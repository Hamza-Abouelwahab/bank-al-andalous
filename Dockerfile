# =========================================================
# STAGE 1: Build React / Inertia / Vite assets
# =========================================================
FROM node:22-alpine AS frontend

WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy only files needed for Vite build
COPY resources ./resources
COPY public ./public
COPY vite.config.* ./
COPY tsconfig*.json ./
COPY components.json ./
COPY tailwind.config.* ./
COPY postcss.config.* ./

# Build production frontend files into public/build
RUN npm run build


# =========================================================
# STAGE 2: Laravel PHP app
# =========================================================
FROM php:8.4-fpm-alpine AS app

WORKDIR /var/www/html

# Install system packages
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    curl \
    zip \
    unzip \
    git \
    icu-dev \
    oniguruma-dev \
    libzip-dev \
    sqlite \
    sqlite-dev \
    postgresql-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev

# Install PHP extensions needed by Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo \
    pdo_mysql \
    pdo_pgsql \
    pdo_sqlite \
    mbstring \
    zip \
    intl \
    bcmath \
    gd \
    opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy full Laravel project
COPY . .

# Copy built frontend assets from Node stage
COPY --from=frontend /app/public/build ./public/build

# Install Laravel PHP dependencies
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

# Create Laravel writable folders and permissions
RUN mkdir -p storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copy Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor config
COPY docker/supervisord.conf /etc/supervisord.conf

# Copy start script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Render will access this port
EXPOSE 8080

CMD ["/start.sh"]