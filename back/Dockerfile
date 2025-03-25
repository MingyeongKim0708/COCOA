FROM bellsoft/liberica-openjdk-alpine:17

# TimeZone 설정
ENV TZ=Asia/Seoul
RUN apk --no-cache add tzdata

WORKDIR /usr/src/app

# 빌드 산출물(JAR) 복사
COPY build/libs/*.jar cocoa.jar
# Dockerfile이 있는 위치를 기준으로 경로를 설정해야 함

# 컨테이너에서 열 포트 (예: 8080)
EXPOSE 8080

# 컨테이너 실행 시 명령
ENTRYPOINT ["java", "-jar", "cocoa.jar"]