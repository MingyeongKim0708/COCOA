## 운영 최적화는 제외하고 만듦 (추후 디벨롭)
# 1단계: 의존성 설치
FROM node:18-alpine AS builder

# 필수 패키지 추가
RUN apk add --no-cache libc6-compat

# 작업 디렉토리 설정(로컬에서는 /app)
WORKDIR /usr/src/app

# package.json 및 package-lock.json 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install

# 전체 코드 복사
COPY . ./

# # 환경 변수 파일 설정 Next.js는 기본적으로 env를 자동으로 가져옴. 만약 필요해지면 사용하자
# ENV DOTENV_CONFIG_PATH=/app/.env-fe

# Next.js 빌드 실행, ESLint 검사 생략
RUN NEXT_PUBLIC_DISABLE_ESLINT=true npm run build

# 2단계: 실행을 위한 이미지 생성
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 빌드된 파일 복사
COPY --from=builder /usr/src/app ./

# 포트 개방
EXPOSE 3000

# Next.js 서버 실행
CMD ["npm", "run", "start"]