#!/bin/bash
set -e

echo "==> Starting XPERT API (ServerSideUp Edition)..."

# Ensure permissions on storage/bootstrap
# (Run as root if needed, but Dockerfile already handle basic setup)

# Run artisan commands
# ServerSideUp's ssu-entrypoint.sh will automatically run things as the correct user 
# if we just invoke php artisan.

php artisan storage:link --force || echo "==> storage:link skipped"
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

echo "==> Handing off to ServerSideUp..."
# This is the standard handoff for ServerSideUp images
exec /usr/local/bin/entrypoint.sh "$@"
