import os
import json
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


def insert_cosmetic(oliveyoung_id: str, product_name: str, option_name: str,
                    product_producer: str, product_category: str, reputations: list, review_amount: int, option_id: int = 1) -> int:
    # 화장품 정보를 삽입하는 함수 (삽입된 화장품의 cosmetic_id 반환)
    query = """
    INSERT INTO cosmetics (oliveyoung_id, option_id, name, option_name, producer, category, 
                           reputation1, reputation2, reputation3, reputation4, oliveyoung_review_amount)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING cosmetic_id;
    """

    conn = get_db_connection()
    if not conn:
        return -1

    try:
        with conn.cursor() as cur:
            cur.execute(query, (oliveyoung_id, option_id, product_name, option_name,
                        product_producer, product_category, *reputations[:4], review_amount))
            cosmetic_id = cur.fetchone()[0]
        return cosmetic_id

    except Exception as e:
        print("화장품 삽입 오류:", e)
        return -1
    finally:
        conn.close()


def is_in_child_cosmetic(oliveyoung_id: str, option_id: int = 1) -> bool:
    # 특정 화장품이 same_cosmetics 테이블에 존재하는지 확인하는 함수
    query = """
    SELECT 1 FROM same_cosmetics
    WHERE child_cosmetic_oliveyoung_id = %s AND child_cosmetic_option_id = %s
    LIMIT 1;
    """

    conn = get_db_connection()
    if not conn:
        return False

    try:
        with conn.cursor() as cur:
            cur.execute(query, (oliveyoung_id, option_id))
            return cur.fetchone() is not None  # 데이터가 있으면 True 반환
    except Exception as e:
        print("동일 상품 조회 오류:", e)
        return False
    finally:
        conn.close()


def insert_same_cosmetic(parent_oliveyoung_id: str, child_oliveyoung_id: str, cosmetic_id: int, child_option_id: int = 1, parent_cosmetic_option_id: int = 0):
    # 동일한 화장품 정보를 삽입하는 함수
    query = """
    INSERT INTO same_cosmetics (parent_cosmetic_oliveyoung_id, parent_cosmetic_option_id, child_cosmetic_oliveyoung_id, child_cosmetic_option_id, child_cosmetic_id)
    VALUES (%s, %s, %s, %s, %s);
    """

    conn = get_db_connection()
    if not conn:
        return False

    try:
        with conn.cursor() as cur:
            cur.execute(query, (parent_oliveyoung_id, parent_cosmetic_option_id,
                        child_oliveyoung_id, child_option_id, cosmetic_id))
        return True
    except Exception as e:
        print("동일한 화장품 삽입 오류:", e)
        return False
    finally:
        conn.close()


def update_same_cosmetic(parent_oliveyoung_id: str, child_oliveyoung_id: str):
    # 동일한 화장품 정보를 업데이트하는 함수
    query = """
    UPDATE same_cosmetics 
    SET parent_cosmetic_oliveyoung_id = %s
    WHERE parent_cosmetic_oliveyoung_id = %s;
    """

    conn = get_db_connection()
    if not conn:
        return False

    try:
        with conn.cursor() as cur:
            cur.execute(query, (parent_oliveyoung_id, child_oliveyoung_id))
        return True
    except Exception as e:
        print("동일한 화장품 갱신 오류:", e)
        return False
    finally:
        conn.close()


def insert_ingredient_text(cosmetic_id: int, product_ingredients: dict):
    # 성분 정보를 삽입하는 함수
    query = """
    INSERT INTO cosmetic_ingredient_text (cosmetic_id, ingredient_text)
    VALUES (%s, %s)
    ON CONFLICT (cosmetic_id) DO UPDATE SET ingredient_text = EXCLUDED.ingredient_text;
    """

    conn = get_db_connection()
    if not conn:
        return False

    try:
        with conn.cursor() as cur:
            json_data = json.dumps(product_ingredients)  # 🔹 dict → JSON 문자열 변환
            cur.execute(query, (cosmetic_id, json_data))
            conn.commit()  # 🔹 COMMIT 추가 (변경 사항 저장)
        return True
    except Exception as e:
        print("성분 정보 삽입 오류:", e)
        return False
    finally:
        conn.close()


def get_all_distinct_parent_cosmetics():
    # 특정 화장품이 same_cosmetics 테이블에 존재하는지 확인하는 함수
    query = """
    SELECT DISTINCT parent_cosmetic_oliveyoung_id 
    FROM same_cosmetics;
    """

    conn = get_db_connection()
    if not conn:
        return False

    try:
        with conn.cursor() as cur:
            cur.execute(query)
            results = cur.fetchall()
            # 결과를 리스트로 변
            return [row[0] for row in results]
    except Exception as e:
        print("동일 상품 조회 오류:", e)
        return False
    finally:
        conn.close()
