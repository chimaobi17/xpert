# STAGE 1: Builder
FROM alpine:3.21 AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    php84 php84-phar php84-openssl php84-curl php84-mbstring \
    php84-tokenizer php84-session php84-ctype php84-xml \
    curl unzip git bc

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php84 -- --install-dir=/usr/local/bin --filename=composer

# Install dependencies (cached layer)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --ignore-platform-reqs

# Copy app code and dump final autoloader
COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative

# STAGE 2: Runtime
FROM alpine:3.21

WORKDIR /app

# Install ONLY runtime PHP 8.4 packages (No dev tools, no composer)
RUN apk add --no-cache \
    php84 php84-pdo php84-pdo_pgsql php84-pgsql php84-mbstring \
    php84-bcmath php84-zip php84-xml php84-curl php84-tokenizer \
    php84-session php84-ctype php84-fileinfo php84-dom \
    php84-openssl php84-iconv php84-simplexml php84-xmlwriter \
    php84-xmlreader php84-sodium php84-gd php84-intl php84-opcache \
    php84-pdo_sqlite php84-posix php84-pcntl \
    bash

# Symlink php
RUN ln -sf /usr/bin/php84 /usr/bin/php

# Copy ONLY necessary files from builder
COPY --from=builder /app /app

# Final permission and storage setup
RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && touch database/database.sqlite

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
