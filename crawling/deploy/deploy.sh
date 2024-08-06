#!/bin/bash

# 이미지 태그 설정
IMAGE_NAME="flask-app"
IMAGE_TAG="1.0"
DOCKER_HUB_REPO="ln8847/flask-app"

# Docker 이미지 빌드
echo "Building Docker image..."
docker build -t $IMAGE_NAME:$IMAGE_TAG ../.

# 빌드된 이미지 ID 확인
IMAGE_ID=$(docker images -q $IMAGE_NAME:$IMAGE_TAG)
if [ -z "$IMAGE_ID" ]; then
    echo "Failed to build the Docker image."
    exit 1
fi
echo "Built Docker image with ID: $IMAGE_ID"

# Docker 이미지 태그 추가
echo "Tagging Docker image..."
docker tag $IMAGE_ID $DOCKER_HUB_REPO:$IMAGE_TAG

# Docker 이미지 푸시
echo "Pushing Docker image to Docker Hub..."
docker push $DOCKER_HUB_REPO:$IMAGE_TAG

echo "Docker image pushed to Docker Hub: $DOCKER_HUB_REPO:$IMAGE_TAG"
