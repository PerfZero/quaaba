#!/bin/bash

# Скрипт деплоя проекта на сервер

set -e

echo "🚀 Начинаем деплой проекта..."

# Обновляем систему
echo "📦 Обновляем систему..."
apt-get update -y
apt-get upgrade -y

# Устанавливаем необходимые пакеты
echo "📦 Устанавливаем Docker и Git..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

# Устанавливаем Docker, если не установлен
if ! command -v docker &> /dev/null; then
    echo "🐳 Устанавливаем Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Устанавливаем Docker Compose, если не установлен
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Устанавливаем Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Создаем директорию для проекта
PROJECT_DIR="/var/www/quaaba"
echo "📁 Создаем директорию проекта: $PROJECT_DIR"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Клонируем или обновляем репозиторий
if [ -d ".git" ]; then
    echo "🔄 Обновляем репозиторий..."
    git pull origin main
else
    echo "📥 Клонируем репозиторий..."
    git clone https://github.com/PerfZero/quaaba.git .
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose down || true

# Собираем и запускаем проект
echo "🔨 Собираем и запускаем проект..."
docker-compose up -d --build

# Показываем статус
echo "✅ Проект запущен!"
echo "📊 Статус контейнеров:"
docker-compose ps

echo ""
echo "🎉 Деплой завершен!"
echo "Frontend доступен на: http://85.198.103.39:3000"
echo "Backend доступен на: http://85.198.103.39:5001"

