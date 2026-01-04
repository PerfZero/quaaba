#!/bin/bash

# Команды для деплоя на сервер 85.198.103.39

# 1. Обновляем систему
apt-get update -y
apt-get upgrade -y

# 2. Устанавливаем необходимые пакеты
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release git

# 3. Устанавливаем Docker (если не установлен)
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# 4. Устанавливаем Docker Compose (если не установлен)
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 5. Создаем директорию для проекта
mkdir -p /var/www/quaaba
cd /var/www/quaaba

# 6. Клонируем репозиторий (или обновляем, если уже существует)
if [ -d ".git" ]; then
    echo "Обновляем репозиторий..."
    git pull origin main
else
    echo "Клонируем репозиторий..."
    git clone https://github.com/PerfZero/quaaba.git .
fi

# 7. Останавливаем существующие контейнеры (если есть)
docker-compose down || true

# 8. Собираем и запускаем проект
docker-compose up -d --build

# 9. Показываем статус
echo "Статус контейнеров:"
docker-compose ps

echo ""
echo "✅ Деплой завершен!"
echo "Frontend: http://85.198.103.39:3000"
echo "Backend: http://85.198.103.39:5001"

