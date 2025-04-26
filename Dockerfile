FROM python:3.9-slim

# 1. Настройка альтернативных зеркал Debian
RUN echo "deb http://ftp.ru.debian.org/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb http://ftp.ru.debian.org/debian bookworm-updates main" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org bookworm-security main" >> /etc/apt/sources.list

# 2. Установка зависимостей с ретраями
RUN apt-get update -o Acquire::Retries=5 && \
    apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# 3. Настройка pip
RUN python -m pip install --upgrade pip && \
    pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/ && \
    pip config set global.trusted-host pypi.tuna.tsinghua.edu.cn && \
    pip config set global.timeout 120

WORKDIR /app
COPY requirements.txt .

# 4. Установка Python-зависимостей
RUN pip install --retries 5 -r requirements.txt

COPY . .

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]