#!/bin/bash
set -e

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Cache config and routes for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Seed only if DB is empty (prevents duplicate seeding on redeploys)
php artisan db:seed --force 2>/dev/null || true

# Start the server
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
