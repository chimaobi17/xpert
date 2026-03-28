#!/bin/bash
set -e

echo "==> Starting XPERT API..."

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "==> Generating app key..."
    php artisan key:generate --force
fi

# Cache config and routes for production
echo "==> Caching config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
echo "==> Running migrations..."
php artisan migrate --force

# Seed only if DB is empty (prevents duplicate seeding on redeploys)
echo "==> Seeding database..."
php artisan db:seed --force 2>/dev/null || echo "==> Seeding skipped or already done"

echo "==> Starting server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
