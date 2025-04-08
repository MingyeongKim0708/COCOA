import os
import psycopg2
import threading
import requests
from collections import defaultdict
from dotenv import load_dotenv
import argparse
import time

# .env 파일 로드
load_dotenv()

# PostgreSQL 연결 설정, DB 환경변수 불러오기
DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', 5432)),
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

WORKER_COUNT = 2
API_URL = "http://j12a507a.p.ssafy.io:5000/analyze/crawl"

def fetch_reviews(start_id, end_id):
    conn = psycopg2.connect(**DB_CONFIG)
    print("✅ DB 연결 성공")

    cursor = conn.cursor()
    cursor.execute("""
        SELECT cosmetic_id, reviews_text
        FROM crawled_reviews
        WHERE cosmetic_id BETWEEN %s AND %s
    """, (start_id, end_id))
    rows = cursor.fetchall()
    conn.close()

    print(f"📦 총 {len(rows)}개 제품 데이터 가져옴")
    
    # cosmetic_id별 리뷰 묶기
    reviews_dict = defaultdict(set)
    for idx, (cosmetic_id, reviews) in enumerate(rows):
        if idx % 10 == 0:
            print(f"🔄 {idx}번째 제품 처리 중 (cosmetic_id={cosmetic_id})")

        try:
            reviews_dict[cosmetic_id].update(set(reviews))
        except Exception as e:
            print(f"⚠️ 리뷰 파싱 오류: {cosmetic_id}, {e}")
    return reviews_dict

def send_job(cosmetic_id, reviews, is_last_batch=False):
    data = {
        "cosmetic_id": cosmetic_id,
        "reviews": list(reviews),
        "is_last_batch": is_last_batch
    }
    try:
        response = requests.post(API_URL, json=data, timeout=10)
        print(f"[{cosmetic_id}번 결과] {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"[{cosmetic_id}] 요청 실패: {e}")

def worker_thread(worker_id, task_ids, reviews_dict):
    for idx, cosmetic_id in enumerate(task_ids):
        reviews = reviews_dict[cosmetic_id]
        is_last = (idx == len(task_ids) - 1)
        send_job(cosmetic_id, reviews, is_last_batch=is_last)
        time.sleep(150)

def main(start_id, end_id):
    reviews_dict = fetch_reviews(start_id, end_id)
    all_ids = sorted(reviews_dict.keys()) # cosmetic_id 오름차순 정렬

    # WORKER_COUNT 기준으로 나누기
    chunked_ids = [[] for _ in range(WORKER_COUNT)]
    for idx, cosmetic_id in enumerate(all_ids):
        chunked_ids[idx % WORKER_COUNT].append(cosmetic_id)

    threads = []
    for worker_id in range(WORKER_COUNT):
        t = threading.Thread(target=worker_thread, args=(worker_id, chunked_ids[worker_id], reviews_dict))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--start', type=int, required=True, help='시작 cosmetic_id')
    parser.add_argument('--end', type=int, required=True, help='끝 cosmetic_id')
    args = parser.parse_args()

    main(args.start, args.end)
