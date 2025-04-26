FROM python:3.9-slim

# 1. Устанавливаем libpq5 из локального кэша (если есть)
#    Если нет - используем образ с уже установленным PostgreSQL
RUN apt-get update || true && \
    (apt-get install -y libpq5 || \
     echo "Warning: libpq5 not installed, ensure psycopg2-binary is in requirements.txt") && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .

# 3. Установка зависимостей через локальное зеркало
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    if grep -q 'psycopg2==' requirements.txt; then \
        pip uninstall -y psycopg2 && \
        pip install --no-cache-dir psycopg2-binary; \
    fi

COPY . .

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]