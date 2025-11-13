#!/bin/bash

# 작업 디렉토리 설정
cd ~/apps/polar-front
rm -rf ~/apps/polar-front/app  # 기존 코드 삭제

# 최신 코드 가져오기
echo "Fetching latest code..."
git clone git@github.com:simpolor/polar-front.git app
cd ~/apps/polar-front/app

# Nginx 설정 파일 생성 (Vue Router history mode 지원)
echo "Creating Nginx configuration..."
cat > nginx.conf << 'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Vue Router history mode 지원
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 멀티스테이지 Dockerfile 생성
echo "Creating Dockerfile with multi-stage build..."
cat > Dockerfile << 'EOF'
# ========================================
# Stage 1: 빌드 스테이지
# ========================================
FROM node:22-alpine AS builder

WORKDIR /app

# package.json과 package-lock.json 복사 (캐싱 최적화)
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# Vite 빌드
RUN npm run build

# ========================================
# Stage 2: 프로덕션 스테이지
# ========================================
FROM nginx:alpine

# 빌드된 파일만 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

# 기존 컨테이너 종료 및 삭제
echo "Stopping and removing old container..."
sudo docker stop polar-front-container 2>/dev/null || true
sudo docker rm polar-front-container 2>/dev/null || true

# 🔹 최근 3개 이미지만 유지하고 나머지 삭제
echo "Removing old images, keeping the latest 3..."
sudo docker images polar-front-image --format "{{.ID}}" | tail -n +4 | xargs -r sudo docker rmi

# ✅ 네트워크 확인 및 생성
echo "Ensuring Docker network exists..."
sudo docker network inspect polar-net >/dev/null 2>&1 || sudo docker network create polar-net

echo "Building Docker image..."
sudo docker rmi polar-front-image 2>/dev/null || true
sudo docker build -t polar-front-image .

# ✅ 네트워크 연결 포함해서 실행
echo "Running new container..."
sudo docker run -d \
  --name polar-front-container \
  --network polar-net \
  -p 3000:80 \
  polar-front-image

echo "Deployment completed successfully."
echo "Frontend is now running at http://localhost:3000"
