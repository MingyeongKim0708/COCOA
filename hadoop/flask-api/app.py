from flask import Flask, request, jsonify
from konlpy.tag import Okt
from queue import Queue
from threading import Thread
from pathlib import Path
from submit_spark import submit_job
from collections import Counter
import time
import subprocess

from logging_setup import setup_logger

logger = setup_logger("Server")

app = Flask(__name__)

WORKER_COUNT = 2

# Spark 작업 큐 생성
spark_queue = Queue()


def spark_worker():
    while True:
        cosmetic_id = spark_queue.get()
        # Spark Job 실행
        success = submit_job(cosmetic_id)
        spark_queue.task_done()


# 워커 스레드 시작 (원하면 여러 개도 가능)
for _ in range(WORKER_COUNT):  # 최대 동시에 2개만 Spark 작업 실행
    Thread(target=spark_worker, daemon=True).start()


@app.route("/analyze/review", methods=["POST"])
def analyze_review():
    data = request.json
    review_id = data["review_id"]
    review_content = data["review"]
    start = time.time()
    okt = Okt()
    words = okt.pos(review_content, stem=True)
    wordlist = [w for w, t in words if t in ['Noun', 'Adjective'] and len(w) > 1]    
    result = dict(Counter(wordlist))
    logger.info("work taked %d", time.time()-start)

    return jsonify({"reviewId": review_id, "keywords": result})


@app.route("/analyze/crawl", methods=["POST"])
def analyze_crawl():
    data = request.json
    cosmetic_id = data["cosmetic_id"]
    reviews = data["reviews"]
    is_last_batch = data.get("is_last_batch", False)

    Path("/tmp/cosmetics").mkdir(parents=True, exist_ok=True)
    local_path = f"/tmp/cosmetics/reviews_{cosmetic_id}.txt"
    with open(local_path, "w", encoding="utf-8") as f:
        if isinstance(reviews, list):
            f.write("\n".join(reviews))
        else:
            f.write(reviews)


    hdfs_path = f"/input/reviews_{cosmetic_id}.txt"
    result = subprocess.run(
        ["hdfs", "dfs", "-put", "-f", local_path, hdfs_path], capture_output=True, text=True)

    if result.returncode != 0:
        logger.error(f"[HDFSUploadFailed] {result.stderr}")
        return jsonify({"status": "hdfs_put_failed"}), 500
    # Spark submit 실행
    spark_queue.put(cosmetic_id)
    return jsonify({"status": "queued"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
