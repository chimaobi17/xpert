FROM debian:bookworm-slim

# Install PHP 8.2 from Debian repos (pre-compiled .deb packages, zero compilation)
RUN apt-get update && apt-get install -y --no-install-recommends \
    php8.2-cli php8.2-pgsql php8.2-mbstring php8.2-bcmath php8.2-zip \
    php8.2-xml php8.2-curl php8.2-sqlite3 \
    git curl unzip ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

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
