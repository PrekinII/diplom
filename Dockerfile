FROM python:3.9-slim-bookworm

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . .

RUN mkdir -p /app/media

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]