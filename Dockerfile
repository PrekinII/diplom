FROM python:3.9

# Обновляем пакеты и устанавливаем зависимости
RUN sed -i 's|http://deb.debian.org|https://deb.debian.org|g' /etc/apt/sources.list \
    && apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    build-essential \
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