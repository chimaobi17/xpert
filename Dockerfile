FROM php:8.2-cli

# Download extension installer (avoid ADD --chmod which requires BuildKit)
RUN curl -sSLf -o /usr/local/bin/install-php-extensions \
    https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions \
    && chmod +x /usr/local/bin/install-php-extensions

# Install only essential PHP extensions (dropped gd/pgsql to reduce memory)
RUN install-php-extensions pdo_pgsql mbstring bcmath zip

RUN apt-get update && apt-get install -y --no-install-recommends git curl unzip \
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
