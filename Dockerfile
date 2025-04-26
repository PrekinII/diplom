FROM python:3.9-slim-bookworm

# 1. Настройка надежных зеркал Debian
RUN echo "deb https://mirror.yandex.ru/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb https://mirror.yandex.ru/debian bookworm-updates main" >> /etc/apt/sources.list && \
    echo "deb https://mirror.yandex.ru/debian-security bookworm-security main" >> /etc/apt/sources.list

# 2. Установка зависимостей с повторами при ошибках
RUN apt-get update -o Acquire::Retries=5 || apt-get update -o Acquire::Retries=5 && \
    apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Настройка альтернативных PyPI-зеркал
COPY pip.conf /etc/pip.conf
COPY requirements.txt .

# 4. Установка Python-зависимостей
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . .

RUN mkdir -p /app/media

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]