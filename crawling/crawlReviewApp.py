from crawler import do_review_croll
from db import get_all_distinct_parent_cosmetics

# 부모모
oliveyoung_ids = get_all_distinct_parent_cosmetics()

# print(oliveyoung_ids)

for id in oliveyoung_ids[:1]:
    print(id)
    review_string = do_review_croll(id)

    # hadoop연결 해서 review_string 보냄
