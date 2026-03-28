FROM alpine:3.19

# Install PHP 8.2 + all required extensions from Alpine repos (pre-compiled)
RUN apk add --no-cache \
    php82 php82-pdo php82-pdo_pgsql php82-pgsql php82-mbstring \
    php82-bcmath php82-zip php82-xml php82-curl php82-tokenizer \
    php82-session php82-ctype php82-fileinfo php82-dom php82-phar \
    php82-openssl php82-iconv php82-simplexml php82-xmlwriter \
    php82-xmlreader php82-sodium php82-gd \
    git curl unzip bash

# Create standard php symlink
RUN ln -sf /usr/bin/php82 /usr/bin/php

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --ignore-platform-reqs

COPY . .
RUN composer dump-autoload --optimize

RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache \
    && touch database/database.sqlite

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
