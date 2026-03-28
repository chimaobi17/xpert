# Deployment Implementation Plan

This document outlines the steps and code required to fix the Xpert deployment build failures.

## Objective
The primary build failure is caused by a PHP version mismatch between the application requirements (PHP 8.4) and the current Docker environment (PHP 8.2). This plan upgrades the container to PHP 8.4 and adds support for PostgreSQL, as required by the production `render.yaml` configuration.

## Required Changes

### 1. Update `composer.json`
The application dependencies, including Symfony 8.0, require PHP 8.4. We must ensure the local configuration reflects this.

**Modify line 12 from:**
```json
"php": "^8.2",
```
**to:**
```json
"php": "^8.4",
```

### 2. Update `Dockerfile`
The `Dockerfile` must be upgraded to use a PHP 8.4 base image and include the necessary drivers for PostgreSQL.

**Complete Updated Dockerfile:**
```dockerfile
# Use official PHP 8.4 CLI Alpine image
FROM php:8.4-cli-alpine

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

WORKDIR /app

# Optimize layer caching: Copy composer files first
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application source code
COPY . .
RUN composer dump-autoload --optimize

# Configure permissions for Laravel
RUN chmod -R 775 storage bootstrap/cache \
    && mkdir -p database && touch database/database.sqlite

EXPOSE 8000

# Setup entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
```

## Deployment Steps

1. **Apply Changes Locally**: Update the files as shown above.
2. **Commit & Push**: Commit the changes to the repository.
3. **Monitor Render**: Watch the deployment logs on Render. The `composer install` step inside the Docker build should now succeed with PHP 8.4.
4. **Database Migration**: The `docker-entrypoint.sh` is already configured to run `php artisan migrate --force` on container startup, which will initialize the PostgreSQL database.

## Verification
- Once deployed, check the Render logs for the message: `==> Starting XPERT API...`
- Verify the `/api/health` endpoint returns `{"status": "ok"}` without authentication.
