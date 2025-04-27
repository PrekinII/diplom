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

# Принимаем аргумент
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]