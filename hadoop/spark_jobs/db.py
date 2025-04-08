import json
import os
import psycopg2
from logging_setup import setup_logger
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT")
}

def save_to_db(cosmetic_id, keyword_map):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    json_keywords = json.dumps(keyword_map, ensure_ascii=False)
    cur.execute("""
        INSERT INTO cosmetic_keywords (cosmetic_id, keywords)
        VALUES (%s, %s)
        ON CONFLICT (cosmetic_id)
        DO UPDATE SET keywords = EXCLUDED.keywords
    """, (cosmetic_id, json_keywords))
    conn.commit()
    cur.close()
    conn.close()
