# Use the ultra-fast ServerSideUp PHP 8.4 image
# This image comes pre-optimized for Laravel and includes Nginx + FPM
FROM serversideup/php:8.4-fpm-nginx AS base

# Switch to root to install dependencies fast
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Switch back to the specialized 'www-data' user
USER www-data

WORKDIR /var/www/html

# Copy only composer files first for maximum caching
COPY --chown=www-data:www-data composer.json composer.lock ./

# Fast non-interactive install
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy the rest of the application
COPY --chown=www-data:www-data . .

# Final optimization
RUN composer dump-autoload --optimize --classmap-authoritative

# Setup environment and permissions
RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Reveal the port Render expects
EXPOSE 8080

# The base image handles the Nginx + FPM startup automatically.
# We just need to ensure our custom entrypoint runs for migrations.
USER root
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Use the image's built-in startup logic but wrap it in our entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
