# ------- Stage 1: Composer Dependencies -------
FROM composer:2 AS composer-deps
WORKDIR /app
COPY composer.json composer.lock ./
# We use --ignore-platform-reqs here because the composer image might not have PHP 8.4
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --ignore-platform-reqs

# ------- Stage 2: Production Image -------
FROM php:8.4-cli-alpine AS production

# Install PHP Extension Installer to simplify modern extension management
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install essential Laravel 12 and PostgreSQL extensions
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    bcmath \
    zip \
    xml \
    curl \
    gd \
    intl \
    mbstring \
    openssl \
    dom \
    tokenizer \
    session \
    ctype \
    fileinfo \
    simplexml \
    xmlwriter \
    xmlreader \
    sodium \
    opcache

# Install common system utilities
RUN apk add --no-cache git curl unzip bash

WORKDIR /var/www/html

COPY --from=composer-deps /app/vendor ./vendor
COPY . .

# Optimize layer caching
RUN composer dump-autoload --optimize

# Configure permissions for Laravel
RUN mkdir -p database storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && touch database/database.sqlite

EXPOSE 8000

# Setup entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
