#!/bin/bash
set -e

PORT=${PORT:-80}

# Update Apache to listen on Railway's PORT if not 80
sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT>/" /etc/apache2/sites-available/000-default.conf

php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan migrate --force

exec apache2-foreground
