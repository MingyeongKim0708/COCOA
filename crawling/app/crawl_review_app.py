from crawler.review_crawler import crawl_reviews
from db import get_all_distinct_parent_cosmetics
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("crawl_review_app")

# 부모모
oliveyoung_ids = get_all_distinct_parent_cosmetics()


# 분할해서 크롤링 합시다 8864 개 추정 1310개 정도씩 하면 될 듯듯
for i in range(4, 1000):
    logger.info("index %s", i)
    review_string = crawl_reviews(oliveyoung_ids[i])
