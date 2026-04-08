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

# Robust Caching: Re-cache with current runtime env vars
echo "==> Optimizing configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Intelligent seeding: Skip heavy DB checks if we already have a success flag
if [ ! -f storage/framework/.seeded ]; then
    echo "==> First run check..."
    # Faster check using a simple artisan command if needed, or just seed
    php artisan db:seed --force && touch storage/framework/.seeded
    echo "==> Database seeded."
else
    echo "==> Application already initialized. Skipping seed."
fi

echo "==> Starting server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
