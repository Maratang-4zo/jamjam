#!/bin/bash

# flask와 springboot가 공유할 네트워크 생성 
network_name="shared-network"

# Check if the network already exists
if ! docker network ls | grep -q "$network_name"; then
    echo "Creating network: $network_name"
    docker network create "$network_name"
else
    echo "Network $network_name already exists"
fi

# Portainer 컨테이너가 실행 중인지 확인하고, 실행 중이지 않으면 실행
if [ "$(docker ps -q -f name=portainer-container)" ]; then
    echo "Portainer container is already running."
else
    echo "Starting portainer container..."
    docker compose up -d portainer-docker
fi

# Redis 컨테이너가 실행 중인지 확인하고, 실행 중이지 않으면 실행
if [ "$(docker ps -q -f name=redis-container)" ]; then
    echo "Redis container is already running."
else
    echo "Starting Redis container..."
    docker compose up -d redis-docker
fi

# MySQL 컨테이너가 실행 중인지 확인하고, 실행 중이지 않으면 실행
if [ "$(docker ps -q -f name=mysql-container)" ]; then
    echo "MySQL container is already running."
else
    echo "Starting MySQL container..."
    docker compose up -d mysql-docker
fi

# phpmyadmin 컨테이너가 실행 중인지 확인하고, 실행 중이지 않으면 실행
if [ "$(docker ps -q -f name=phpmyadmin-container)" ]; then
    echo "phpmyadmin container is already running."
else
    echo "Starting phpmyadmin-container..."
    docker compose up -d phpmyadmin-docker
fi


# Blue-Green 배포
EXIST_BLUE=$(docker ps | grep blue)

if [ -z "$EXIST_BLUE" ]; then
    echo "No blue container running. Starting blue container..."
    docker-compose build spring-blue
    docker-compose up -d --force-recreate spring-blue 
    BEFORE_COLOR="green"
    AFTER_COLOR="blue"
    BEFORE_PORT=8081
    AFTER_PORT=8080
else
    echo "Blue container is running. Starting green container..."
    docker-compose build spring-green
    docker-compose up -d --force-recreate spring-green
    BEFORE_COLOR="blue"
    AFTER_COLOR="green"
    BEFORE_PORT=8080
    AFTER_PORT=8081
fi

echo "${AFTER_COLOR} server up(port:${AFTER_PORT})"

echo "Health Check..."
for cnt in {1..10}; do
#do
    echo "서버 응답 확인중(${cnt}/10)";
    UP=$(curl -s https://jjam.shop/api/check)
    if [ -z "${UP}" ] 
        then
            sleep 10
            continue
        else
            break
    fi
done

if [ $cnt -eq 10 ]
then
    echo "서버가 정상적으로 구동되지 않았습니다."
    exit 1
fi

echo "Reload Nginx..."
sudo cp /etc/nginx/nginx.${AFTER_COLOR}.conf /etc/nginx/nginx.conf # nginx.conf 복사
sudo nginx -s reload

echo "Deploy Completed!!"

echo "${BEFORE_COLOR} server down(port:${BEFORE_PORT})"
docker rm -f spring-${BEFORE_COLOR} 

echo "Deployment script completed."

