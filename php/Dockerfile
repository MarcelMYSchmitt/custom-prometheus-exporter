#FROM php:7.1.3-fpm as build
FROM php:7.2-cli

WORKDIR /app

#RUN apt-get update && apt-get install -y \
#    zlib1g-dev \
#    zip unzip php-pclzip

# Install Composer
#RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install prometheus client libary via composer
#RUN composer require endclothing/prometheus_client_php

#RUN ls 

#FROM php:7.4.7-apache  as runtime

#COPY --from=build /app /var/www/html
#COPY Prometheus /var/www
#COPY index.php /var/www/html 

#RUN ls var/www/html
COPY . ./
#COPY . ./var/www/html

CMD ["php", "./main.php"]
#CMD [ "php", "-S 0.0.0.0:80", "./index.php" ]



