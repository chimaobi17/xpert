#!/bin/bash
set -e

echo "==> Starting XPERT API..."

# Create .env if it doesn't exist (Render injects env vars, but artisan needs the file)
if [ ! -f .env ]; then
    echo "==> Creating .env from environment..."
    touch .env
fi

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "==> Generating app key..."
    php artisan key:generate --force
fi

# Cache config for production (skip route:cache — closure routes can't be cached)
echo "==> Caching config..."
php artisan config:cache
php artisan view:cache

# Run migrations
echo "==> Running migrations..."
php artisan migrate --force

# Seed only if DB is empty (prevents duplicate seeding on redeploys)
echo "==> Seeding database..."
php artisan db:seed --force 2>/dev/null || echo "==> Seeding skipped or already done"

echo "==> Starting server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
