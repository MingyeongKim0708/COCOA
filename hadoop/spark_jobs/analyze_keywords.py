from pyspark.sql import SparkSession
from konlpy.tag import Okt
import json
import sys
import time
from db import save_to_db
from logging_setup import setup_logger

logger = setup_logger("SubmitSpark")

cosmetic_id = sys.argv[1]
input_path = f"hdfs:///input/reviews_{cosmetic_id}.txt"

start = time.time()
spark = SparkSession.builder.appName("KeywordAnalysis").getOrCreate()
sc = spark.sparkContext
logger.info(f"[TIME] SparkSession created - {time.time() - start:.2f}s")

start = time.time()
rdd = sc.textFile(input_path)
logger.info(f"[TIME] HDFS textFile loaded - {time.time() - start:.2f}s")

start = time.time()
def extract_words_partition(lines):
    okt = Okt()
    for i, line in enumerate(lines):
        start_line = time.time()
        words = okt.pos(line, stem=True)
        if i % 100 == 0:
            logger.info(f"[TIME] {i} line execution : {time.time() - start_line:.4f}s")
        yield from [w for w, t in words if t in ['Noun', 'Adjective'] and len(w) > 1]


words = rdd.mapPartitions(extract_words_partition)
logger.info(f"[TIME] Morphological analysis with Okt - {time.time() - start:.2f}s")

start = time.time()
counts = words.map(lambda w: (w, 1)).reduceByKey(lambda a, b: a + b)
logger.info(f"[TIME] Word count completed - {time.time() - start:.2f}s")

start = time.time()
result_dict = dict(counts.collect())
logger.info(f"[TIME] Result collected - {time.time() - start:.2f}s")

start = time.time()
save_to_db(cosmetic_id, result_dict)
logger.info(f"[TIME] Saved to DB - {time.time() - start:.2f}s")