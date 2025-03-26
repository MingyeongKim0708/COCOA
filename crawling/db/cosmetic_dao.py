import os
from db.connection import get_db_connection
from datetime import datetime
from model.cosmetic import Cosmetic


def insert_cosmetic_from_fields(oliveyoung_id: str, product_name: str, option_name: str,
                                product_producer: str, product_category: str, reputations: list, review_amount: int, option_id: int = 1) -> int:
    # 화장품 정보를 삽입하는 함수 (삽입된 화장품의 cosmetic_id 반환)
    query = """
    INSERT INTO cosmetics (oliveyoung_id, option_id, name, option_name, producer, category, 
                           reputation1, reputation2, reputation3, reputation4, 
                           created_by, created_at, updated_by, updated_at, oliveyoung_review_amount)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING cosmetic_id;
    """

    conn = get_db_connection()
    if not conn:
        return -1

    user = os.environ.get("USERNAME", "unknown")  # 혹은 "CREATED_BY" 등 다른 키로
    now = datetime.now()

    try:
        with conn.cursor() as cur:
            cur.execute(query, (oliveyoung_id, option_id, product_name, option_name,
                        product_producer, product_category, *reputations[:4],
                                user, now, user, now, review_amount))
            cosmetic_id = cur.fetchone()[0]
        return cosmetic_id

    except Exception as e:
        print("화장품 삽입 오류:", e)
        return -1
    finally:
        conn.close()


def insert_cosmetic_from_object(cosmetic: Cosmetic):
    query = """
    INSERT INTO cosmetics (oliveyoung_id, option_id, name, option_name, producer, category, 
                                reputation1, reputation2, reputation3, reputation4,
                                image_url1, image_url2, image_url3,
                                created_by, created_at, updated_by, updated_at, oliveyoung_review_amount)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING cosmetic_id;
    """

    conn = get_db_connection()
    if not conn:
        return -1

    user = os.environ.get("USERNAME", "unknown")  # 혹은 "CREATED_BY" 등 다른 키로
    now = datetime.now()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (cosmetic.oliveyoung_id, cosmetic.option_id, cosmetic.name,
                                cosmetic.option_name, cosmetic.producer, cosmetic.category,
                                cosmetic.reputation1, cosmetic.reputation2, cosmetic.reputation3,
                                cosmetic.reputation4, cosmetic.image_url1, cosmetic.image_url2, cosmetic.image_url3,
                                user, now, user, now, cosmetic.oliveyoung_review_amount))
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


def get_cosmetic_by_oliveyoung_id_and_opt_no(oliveyoung_id, opt_no) -> Cosmetic:
    query = """
    SELECT * FROM old_cosmetics
    WHERE oliveyoung_id = %s AND option_id = %s
    """

    conn = get_db_connection()
    if not conn:
        return False

    try:
        with conn.cursor() as cur:
            cur.execute(query, (oliveyoung_id, opt_no))
            row = cur.fetchone()
            print(row)
            if row:
                return Cosmetic(*row)
            else:
                return
    except Exception as e:
        print("상품 조회 오류:", e)
        return False
    finally:
        conn.close()
