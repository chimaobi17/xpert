FROM php:8.2-cli

# Install dev libraries needed for PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev libonig-dev libzip-dev git curl unzip \
    && rm -rf /var/lib/apt/lists/*

# Compile extensions one at a time to minimize peak memory on 512MB hosts
RUN docker-php-ext-install pdo_pgsql
RUN docker-php-ext-install mbstring
RUN docker-php-ext-install bcmath
RUN docker-php-ext-install zip

# Clean up dev libraries to save space
RUN apt-get purge -y libpq-dev libonig-dev libzip-dev \
    && apt-get autoremove -y --purge \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY . .
RUN composer dump-autoload --optimize

RUN chmod -R 775 storage bootstrap/cache \
    && mkdir -p database && touch database/database.sqlite

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
