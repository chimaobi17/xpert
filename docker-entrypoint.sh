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

# Cache config for production (skip route:cache — closure routes can't be cached)
echo "==> Caching config..."
php artisan config:cache || echo "==> config:cache failed, continuing..."

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
