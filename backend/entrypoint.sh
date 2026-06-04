#!/bin/bash

PORT=${PORT:-80}
echo "=== PORT: $PORT ==="
echo "=== DB_HOST: $DB_HOST ==="

sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT>/" /etc/apache2/sites-available/000-default.conf

echo "=== Running migrations ==="
php artisan migrate --force || echo "=== Migration failed, check DB vars ==="

echo "=== Starting Apache ==="
exec apache2-foreground
