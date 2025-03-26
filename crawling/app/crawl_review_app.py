from crawler.review_crawler import crawl_reviews
from db import get_all_distinct_parent_cosmetics

# 부모모
oliveyoung_ids = get_all_distinct_parent_cosmetics()


# 분할해서 크롤링 합시다 8864 개 추정 1310개 정도씩 하면 될 듯듯
for id in oliveyoung_ids[1310:2620]:
    review_string = crawl_reviews(id)

    # hadoop연결 해서 review_string 보냄
