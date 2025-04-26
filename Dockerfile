FROM python:3.9-alpine

RUN apk add --no-cache postgresql-libs

WORKDIR /app
COPY requirements.txt .

RUN pip install --index-url https://pypi.tuna.tsinghua.edu.cn/simple/ -r requirements.txt

COPY . .

CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000"]