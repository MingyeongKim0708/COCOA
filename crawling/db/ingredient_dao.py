import json
from db.connection import get_db_connection


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
        return True
    except Exception as e:
        print("성분 정보 삽입 오류:", e)
        return False
    finally:
        conn.close()


def get_old_cosmetic_ingredient_text_by_cosmetic_id(cosmetic_id: int) -> dict:
    query = """
    SELECT ingredient_text 
    FROM old_cosmetic_ingredient_text
    WHERE cosmetic_id = %s
    """

    conn = get_db_connection()
    if not conn:
        return False

    try:
        with conn.cursor() as cur:
            cur.execute(query, (cosmetic_id,))
            row = cur.fetchone()
            result = row[0]

            if isinstance(result, str):
                return json.loads(result)  # 문자열이면 파싱
            elif isinstance(result, dict):
                return result              # 이미 dict면 그대로 반환
            else:
                return {}

    except Exception as e:
        print("상품 조회 오류:", e)
        return False
    finally:
        conn.close()
