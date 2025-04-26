FROM python:3.9-slim

# 1. Копируем локальные Python-пакеты
COPY pip_packages /tmp/pip_packages
COPY requirements.txt .

# 2. Устанавливаем зависимости без интернета
RUN pip install --no-index --find-links file:///tmp/pip_packages -r requirements.txt

WORKDIR /app

# 3. Копируем приложение
COPY . .

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]