FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# Jenkins에서 빌드된 결과물 복사
COPY .next .next
COPY public public
COPY package.json .
COPY next.config.ts .

# 포트 개방
EXPOSE 3000

# Next.js 서버 실행
CMD ["npm", "run", "start"]