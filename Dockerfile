# Use Alpine 3.21 for the fastest possible build times (Zero Compilation)
FROM alpine:3.21

# Install pre-compiled PHP 8.4 packages (Installs in seconds, No 'docker-php-ext-install' compile time)
RUN apk add --no-cache \
    php84 php84-fpm php84-pdo php84-pdo_pgsql php84-pgsql php84-mbstring \
    php84-bcmath php84-zip php84-xml php84-curl php84-tokenizer \
    php84-session php84-ctype php84-fileinfo php84-dom php84-phar \
    php84-openssl php84-iconv php84-simplexml php84-xmlwriter \
    php84-xmlreader php84-sodium php84-gd php84-intl php84-opcache \
    php84-pdo_sqlite php84-pcntl php84-posix \
    curl unzip bash bash-completion

# Symlink php
RUN ln -sf /usr/bin/php84 /usr/bin/php

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

# Optimize layer caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --ignore-platform-reqs

# Copy application source (excluding 200MB+ of frontend via .dockerignore)
COPY . .

# Final internal optimization
RUN composer dump-autoload --optimize --classmap-authoritative

# Permissions and structure
RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && touch database/database.sqlite

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Use standard artisan serve for simplicity and speed on Render Free Tier
ENTRYPOINT ["docker-entrypoint.sh"]
