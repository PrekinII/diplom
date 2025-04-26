FROM python:3.9

# Перезаписываем зеркала Debian на HTTPS
RUN echo "deb https://deb.debian.org/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb https://deb.debian.org/debian bookworm-updates main" >> /etc/apt/sources.list && \
    echo "deb https://security.debian.org/debian-security bookworm-security main" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    build-essential \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY requirements.txt .

# Устанавливаем Python-зависимости
RUN pip install --upgrade pip && pip install -r requirements.txt

# Копируем код проекта
COPY . .

# Создаём папку для медиафайлов
RUN mkdir -p /app/media

# Команда запуска
CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]