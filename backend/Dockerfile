FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
# Keep dev deps so Prisma CLI is available for migrate deploy.
RUN npm ci

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node src/server.js"]