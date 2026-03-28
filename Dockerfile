FROM alpine:3.19

RUN apk add --no-cache \
    php82 php82-pdo php82-pdo_pgsql php82-pgsql php82-mbstring \
    php82-bcmath php82-zip php82-xml php82-curl php82-tokenizer \
    php82-session php82-ctype php82-fileinfo php82-dom php82-phar \
    php82-openssl php82-iconv php82-simplexml php82-xmlwriter \
    php82-xmlreader php82-sodium php82-gd \
    git curl unzip bash

RUN ln -sf /usr/bin/php82 /usr/bin/php

RUN php -m

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

EXPOSE 8000
CMD ["php", "-v"]
