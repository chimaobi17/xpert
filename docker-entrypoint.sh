#!/bin/bash
set -e

echo "==> Starting XPERT API (Ultra-Fast Edition)..."

# Sync DB
php artisan migrate --force

# Robust Caching
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Intelligent seeding
if [ ! -f storage/framework/.seeded ]; then
    echo "==> Seeding initial data..."
    php artisan db:seed --force && touch storage/framework/.seeded
fi

echo "==> Starting server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
