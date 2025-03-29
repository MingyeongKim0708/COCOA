import os
import psycopg2
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# PostgreSQL 데이터베이스 연결 설정 (환경 변수 사용)
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT")
}


def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True  # 자동 커밋 활성화
        return conn
    except Exception as e:
        print("데이터베이스 연결 실패:", e)
        return None
