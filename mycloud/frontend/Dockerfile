# FROM node:22.12.0 as build
FROM node:18.20.2 as build
# Принимаем аргумент
# ARG REACT_APP_API_BASE_URL
# ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL


WORKDIR /app
COPY . .
# COPY package*.json ./
# COPY .env .env
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ../../nginx/nginx.conf /etc/nginx/nginx.conf
COPY ../../nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]