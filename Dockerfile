FROM python:3.9-slim

# 1. Копируем локальные зависимости
COPY pip_packages /tmp/pip_packages

# 2. Устанавливаем системные библиотеки
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq5 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Копируем requirements.txt
COPY requirements.txt .

# 4. Устанавливаем Python-зависимости из локальных файлов
RUN pip install --no-index --find-links file:///tmp/pip_packages -r requirements.txt

# 5. Копируем остальной код
COPY . .

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]