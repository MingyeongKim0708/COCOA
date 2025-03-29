from db.connection import get_db_connection


def insert_cosmetic_reviews(cosmetic_id: int, reviews: list[str]):
    # 화장품 리뷰 텍스트를 저장하는 함수
    query = """
    INSERT INTO crawled_reviews (cosmetic_id, reviews_text)
    VALUES (%s, %s)
    RETURNING cosmetic_id;
    """

    conn = get_db_connection()
    if not conn:
        return -1

    try:
        with conn.cursor() as cur:
            cur.execute(query, (cosmetic_id, reviews))  # 그냥 reviews list 넘기면 됨
            cosmetic_id_returned = cur.fetchone()[0]
            conn.commit()
            return cosmetic_id_returned
    except Exception as e:
        print(f"크롤링 삽입 오류: {e}")
        return
    finally:
        conn.close()
