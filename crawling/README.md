# about

올리브영에서 화장품 정보를 가져오는 크롤링 디렉토리 입니다.

# 실행하기 전

아래 라이브러리를 설치해주세요

```
pip install beautifulsoup4 requests  selenium webdriver_manager python-dotenv psycopg2 boto3
```


.env 파일을 만들어 주세요

```
DB_NAME =
DB_USER =
DB_PASSWORD =
DB_HOST =
DB_PORT =
```


## app/crawl_product_app.py

상위 제품 크롤링 실행 파일입니다

실행 코드
```
S12P21A507\crawling>$ python -m app.crawl_product_app
```

## app/crawl_review_app.py

리뷰 크롤링 실행 파일입니다

실행 코드
```
S12P21A507\crawling>$ python -m app.crawl_review_app
```

## crawler

크롤링 관련 함수가 있는 폴더입니다.

## db

데이터베이스와 통신하는 폴더입니다.
