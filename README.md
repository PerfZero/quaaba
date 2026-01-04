# Fullstack приложение

Fullstack приложение на JavaScript с Next.js, Ant Design и Express.js, развертываемое через Docker.

## 🚀 Технологии

- **Frontend**: Next.js 14 (App Router) + Ant Design 5 + TypeScript
- **Backend**: Express.js + Node.js
- **Развертывание**: Docker + Docker Compose

## 📁 Структура проекта

```
uqqba/
├── frontend/          # Next.js приложение
├── backend/           # Express.js API
├── docker-compose.yml # Docker Compose конфигурация
└── README.md
```

## 🛠️ Установка и запуск

### Локальная разработка

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
Откроется на http://localhost:3000

#### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
API будет доступен на http://localhost:5000

##- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📝 API Endpoints

- `GET /api/health` - Проверка здоровья API
- `GET /api/test` - Тестовый endpoint

## 🔧 Переменные окружения

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

### Frontend
Создайте `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📦 Команды

### Frontend
- `npm run dev` - Запуск dev сервера
- `npm run build` - Сборка для production
- `npm run start` - Запуск production сервера

### Backend
- `npm run dev` - Запуск с nodemon (автоперезагрузка)
- `npm start` - Запуск production сервера

## 🔄 Docker для разработки

Для разработки с hot-reload используйте:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Это запустит сервисы с автоматической перезагрузкой при изменении кода.
# quaaba
