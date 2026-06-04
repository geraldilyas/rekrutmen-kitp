#!/bin/bash
set -e

# Configure Apache to listen on Railway's PORT (default 80)
PORT=${PORT:-80}
sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT>/" /etc/apache2/sites-available/*.conf

# Run migrations
php artisan migrate --force

# Start Apache
exec apache2-foreground
