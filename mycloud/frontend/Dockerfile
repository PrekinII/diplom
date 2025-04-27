# FROM node:22.12.0 as build
#
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
#
# RUN npm run build
#
# # Production web server
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
#
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
FROM node:22.12.0 as build

WORKDIR /app

# Копируем .env в контейнер
COPY ../.env ./

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальные файлы
COPY . .

# Собираем приложение (переменные из .env будут доступны)
RUN npm run build

# Production web server
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Копируем nginx конфиг (если нужно)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]