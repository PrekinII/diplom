# Облачное хранилище

Дипломный проект: веб-приложение для хранения файлов с использованием Django, React и PostgreSQL.

## Структура проекта

diplom_1/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  mycloud/  # Основное приложение  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  frontend/   # React-приложение  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  media/      # Загружаемые файлы  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  mycloud/    # Настройки Django  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  users/      # Приложение пользователей  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  storage/    # Приложение хранилища  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  docker-compose.yml  # Конфигурация Docker  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Dockerfile          # Конфигурация backend  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  .env                # Переменные окружения  

## Технологический стек

- Backend: Django 4.2, Django REST Framework
- Frontend: React, React Router
- База данных: PostgreSQL
- Контейнеризация: Docker, Docker Compose
- Веб-сервер: Nginx, Gunicorn

## Развертывание на сервере

### Требования
- Ubuntu 20.04+
- Docker 20.10+
- Docker Compose 1.29+

### Инструкция по установке

1. Склонируйте репозиторий:

git clone https://github.com/PrekinII/diplom.git
cd diplom

cp .env.example .env  
nano .env  # Отредактируйте настройки  
DB_NAME=db_name
DB_USER=user_name
DB_PASSWORD=your pass
DB_HOST=your host
DB_PORT=5432
REACT_APP_API_BASE_URL=your host
DJANGO_SECRET_KEY=secret key



Запустите приложение:
``
docker-compose up -d --build
``  
Примените миграции:
``
docker-compose exec backend python manage.py migrate
``  
Создайте суперпользователя:
``
docker-compose exec backend python /app/mycloud/manage.py createsuperuser
``  
Соберите статику:
``
docker-compose exec backend python manage.py collectstatic
``  
Доступ к приложению

    Frontend: http://ваш-сервер:3000

    Админ-панель: http://ваш-сервер:/admin/
    (используйте созданные учетные данные суперпользователя)

Дополнительные команды

Остановка приложения:

```bash

docker-compose down
```
Просмотр логов:

```bash

docker-compose logs -f
```
Рестарт сервисов:

```bash

docker-compose restart backend frontend db
```