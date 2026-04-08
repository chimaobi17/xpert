#!/bin/bash

echo "==> Starting XPERT API..."
echo "==> PHP version: $(php -v | head -1)"
echo "==> APP_ENV: ${APP_ENV}"

# Create .env if it doesn't exist (Render injects env vars directly)
if [ ! -f .env ]; then
    echo "==> Creating empty .env (env vars from Render)..."
    touch .env
fi

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "==> Generating app key..."
    php artisan key:generate --force || echo "==> key:generate failed"
fi

# Link storage
php artisan storage:link --force || echo "==> storage:link skipped"

# Run migrations (This is the only necessary runtime DB task)
echo "==> Syncing database..."
php artisan migrate --force

# Intelligent seeding: Only seed if the database appears empty
# This saves time on every redeploy
AGENT_COUNT=$(php artisan tinker --execute="echo App\Models\AiAgent::count();")
if [ "$AGENT_COUNT" -eq "0" ]; then
    echo "==> First run detected. Seeding initial data..."
    php artisan db:seed --force
else
    echo "==> Database already populated. Skipping seed."
fi

echo "==> Starting server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
