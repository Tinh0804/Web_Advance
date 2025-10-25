#!/bin/bash
set -e

# Thông tin repo Docker Hub
IMAGE_NAME="tinh08042005/learninglanguage"
TAG="latest"

echo "🔹 Bước 1: Build image backend..."
docker build -t $IMAGE_NAME:$TAG .

echo "🔹 Bước 2: Đăng nhập Docker Hub (nếu chưa login)..."
docker login

echo "🔹 Bước 3: Push image lên Docker Hub..."
docker push $IMAGE_NAME:$TAG

echo "✅ Hoàn tất! Image đã được push lên Docker Hub: $IMAGE_NAME:$TAG"

# chạy file
# chmod +x deploy.sh
# ./deploy.sh
