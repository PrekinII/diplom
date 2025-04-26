FROM python:3.9-slim-bookworm

WORKDIR /app

# Установка системных зависимостей для PostgreSQL
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq-dev gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Используем более быстрые зеркала PyPI
COPY requirements.txt .
RUN pip install --upgrade pip --index-url https://pypi.tuna.tsinghua.edu.cn/simple/ && \
    pip install -r requirements.txt --index-url https://pypi.tuna.tsinghua.edu.cn/simple/ --trusted-host pypi.tuna.tsinghua.edu.cn

COPY . .

RUN mkdir -p /app/media

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]