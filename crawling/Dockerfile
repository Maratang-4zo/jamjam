FROM python:3.11-slim

# 시스템 종속성 설치
RUN apt-get update \
    && apt-get install -y pkg-config \
    && apt-get install -y libmariadb-dev \
    && apt-get install -y build-essential \
    && apt-get install -y tzdata # docker-compose에서 설정한 timezone 반영

# 시간대 설정
ENV TZ=Asia/Seoul

WORKDIR /app
COPY . .

# Python 패키지 설치
RUN pip install -r requirements.txt

EXPOSE 5100

# Flask 앱 실행
CMD ["python", "run.py", "--host=0.0.0.0"]
