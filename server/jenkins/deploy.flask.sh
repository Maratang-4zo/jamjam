# flask 컨테이너가 실행 중인지 확인하고, 실행 중이면 중지
if [ "$(docker ps -q -f name=flask-container)" ]; then
    echo "Stopping flask container..."
    docker stop flask-container
    # flask-container 제거
    docker rm flask-container
else
    echo "Flask container is already stopped or not present."
fi

# 새로운 이미지를 가져오기
echo "Pulling the latest image..."
docker pull ln8847/flask-app:1.0

# Docker Compose를 사용하여 컨테이너 시작
echo "Starting the flask container with Docker Compose..."
docker-compose -f docker-compose.flask.yml up -d

# 배포 완료 메시지 출력
echo "Deployment complete"
