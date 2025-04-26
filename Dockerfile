FROM python:3.9-slim

RUN pip config set global.index-url https://mirror.baidu.com/pypi/simple/ && \
    pip config set global.trusted-host mirror.baidu.com && \
    pip config set global.timeout 300 && \
    pip config set install.retries 10

WORKDIR /app

COPY requirements.txt .

RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir --progress-bar on -r requirements.txt

COPY . .

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]