FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Генерируем Prisma client
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
