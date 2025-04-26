FROM debian:bookworm

# Устанавливаем Python и системные зависимости
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    gcc \
    libpq-dev \
    build-essential \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# Обновляем pip и устанавливаем зависимости
RUN pip3 install --upgrade pip \
    && pip3 install -r requirements.txt --index-url=https://pypi.org/simple

COPY . .

RUN mkdir -p /app/media

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]