FROM alpine:3.21

# Install pre-compiled PHP 8.4 packages
RUN apk add --no-cache \
    php84 php84-pdo php84-pdo_pgsql php84-pgsql php84-mbstring \
    php84-bcmath php84-zip php84-xml php84-curl php84-tokenizer \
    php84-session php84-ctype php84-fileinfo php84-dom php84-phar \
    php84-openssl php84-iconv php84-simplexml php84-xmlwriter \
    php84-xmlreader php84-sodium php84-gd php84-intl php84-opcache \
    php84-pdo_sqlite \
    git curl unzip bash

# Symlink php84 to php
RUN ln -sf /usr/bin/php84 /usr/bin/php

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

# Install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --ignore-platform-reqs

# Copy application code
COPY . .

# Dump optimized autoloader
RUN composer dump-autoload --optimize --classmap-authoritative

# Prepare Laravel directories and permissions
RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache \
    && touch database/database.sqlite

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
