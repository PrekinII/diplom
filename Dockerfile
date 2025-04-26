FROM python:3.9

# Обновляем пакеты и устанавливаем зависимости
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt --index-url=https://pypi.org/simple

# Копируем всё остальное
COPY . .

# Создаём папку для медиафайлов
RUN mkdir -p /app/media

# Запускаем приложение
CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]