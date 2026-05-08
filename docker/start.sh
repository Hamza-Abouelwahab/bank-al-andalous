#!/usr/bin/env bash
set -e

cd /var/www/html

echo "Starting Laravel production setup..."

# Create app key only if missing
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is missing. Generate one locally and add it to your hosting environment."
fi

# Laravel production caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations automatically
# For first deploy, this is useful.
# Later, you can remove this and run migrations manually from hosting dashboard.
php artisan migrate --force

echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisord.conf