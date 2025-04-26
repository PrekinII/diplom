FROM python:3.9.13-slim

# Устанавливаем системные зависимости, нужные для сборки пакетов Python
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл зависимостей
COPY requirements.txt .

# Обновляем pip и устанавливаем зависимости (с явным указанием PyPI)
RUN pip install --upgrade pip \
    && pip install -r requirements.txt --index-url=https://pypi.org/simple

# Копируем остальной код проекта
COPY . .

# Создаём папку для медиафайлов
RUN mkdir -p /app/media

# Запуск через gunicorn
CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]