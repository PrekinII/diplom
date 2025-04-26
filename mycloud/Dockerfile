FROM python:3.9.13-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ../requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

RUN mkdir -p /app/media

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]