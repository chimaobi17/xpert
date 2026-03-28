#!/bin/bash

echo "==> Starting XPERT API..."
echo "==> PHP version: $(php -v | head -1)"
echo "==> DB_CONNECTION: ${DB_CONNECTION}"
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

# Clear old cached config then re-cache with current env vars
echo "==> Caching config..."
php artisan config:clear || true
php artisan config:cache || echo "==> config:cache failed, continuing..."

# Debug: show which DB config will be used
echo "==> DB_CONNECTION: ${DB_CONNECTION:-not set}"
echo "==> DB_HOST: ${DB_HOST:-not set}"
echo "==> DB_PORT: ${DB_PORT:-not set}"
echo "==> DB_USERNAME: ${DB_USERNAME:-not set}"
echo "==> DB_DATABASE: ${DB_DATABASE:-not set}"
echo "==> DB_SSLMODE: ${DB_SSLMODE:-not set}"

# Verify config:cache resolved correctly
php artisan tinker --execute="echo 'Cached DB driver: '.config('database.default').PHP_EOL.'Cached DB host: '.config('database.connections.pgsql.host').PHP_EOL.'Cached DB user: '.config('database.connections.pgsql.username').PHP_EOL.'Cached DB url: '.var_export(config('database.connections.pgsql.url'),true).PHP_EOL;" 2>/dev/null || echo "==> tinker debug failed"

echo "==> Caching views..."
php artisan view:cache || echo "==> view:cache failed, continuing..."

# Run migrations
echo "==> Running migrations..."
php artisan migrate --force || echo "==> Migration failed, continuing..."

# Seed only if DB is empty (prevents duplicate seeding on redeploys)
echo "==> Seeding database..."
php artisan db:seed --force 2>/dev/null || echo "==> Seeding skipped or already done"

echo "==> Starting server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
