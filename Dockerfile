FROM python:3.9.13

# Устанавливаем DNS внутри контейнера
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf

# Обновляем пакеты и устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    build-essential \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt --index-url=https://pypi.org/simple

COPY . .

RUN mkdir -p /app/media

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]