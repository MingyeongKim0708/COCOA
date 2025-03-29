import logging
from crawler.parse_ingredient import parse_ingredient_by_cosmetic_id
from db.cosmetic_dao import get_cosmetic_by_oliveyoung_id_and_opt_no, insert_cosmetic_from_object
from db.category_dao import get_category_id_by_category_no
from db.review_dao import insert_cosmetic_reviews
from s3.upload import upload_image_to_s3
from crawler.driver import create_driver
from model.cosmetic import Cosmetic
from bs4 import BeautifulSoup
import time
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium import webdriver
import requests

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


COLOR_CATEGORY = "10000010002"


def crawl_reviews(oliveyoung_id):

    url = f"https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo={oliveyoung_id}"

    # WebDriver 실행
    driver = create_driver()
    driver.get(url)
    # 페이지 로딩 대기
    time.sleep(2)

    # 상세정보 탭 클릭 (안전하게 시도) - 실패한다면 "fail" return
    try:
        tab = driver.find_element(By.CSS_SELECTOR, "a.goods_reputation")
        ActionChains(driver).move_to_element(tab).click().perform()
        time.sleep(1)
    except:
        return "fail"

    # 페이지 소스를 가져와 BeautifulSoup으로 파싱
    soup = BeautifulSoup(driver.page_source, "html.parser")

    # 크롤링된 화장품 정보 가져오기
    parent_cosmetic = get_cosmetic_by_oliveyoung_id_and_opt_no(
        oliveyoung_id, 0)

    update_cosmetic_images(parent_cosmetic, soup)

    if parent_cosmetic.category.startswith(COLOR_CATEGORY):
        # 카테고리 업데이트
        parent_cosmetic.category = get_category_id_by_category_no(
            parent_cosmetic.category[:15])
        crawl_color_cosmetic_review(parent_cosmetic, soup, driver)
    else:
        # 카테고리 업데이트
        parent_cosmetic.category = get_category_id_by_category_no(
            parent_cosmetic.category[:15])
        crawl_one_cosmetic_review(parent_cosmetic, soup, driver)

    driver.quit()
    return


def update_cosmetic_images(cosmetic: Cosmetic, soup: BeautifulSoup):
    image_lis = soup.select("ul.prd_thumb_list>li")
    for idx, image_li in enumerate(image_lis[:3]):
        img_tag = image_li.find("img")
        if img_tag:
            src = img_tag.get("src").replace("/85/", "/550/")
            s3_url = upload_image_to_s3(src)
            if idx == 0:
                cosmetic.image_url1 = s3_url
            elif idx == 1:
                cosmetic.image_url2 = s3_url
            elif idx == 2:
                cosmetic.image_url3 = s3_url


def crawl_color_cosmetic_review(cosmetic: Cosmetic, soup: BeautifulSoup, driver: webdriver):
    # 모든 옵션 가져오기
    items = soup.select("ul.sel_option_list>li") if soup.select(
        "ul.sel_option_list>li") else None

    if items == None:
        crawl_one_cosmetic_review(cosmetic, soup, driver)
    else:
        for item in items:
            optgoodsinfo = item.get("optgoodsinfo", "없음")
            if optgoodsinfo == "없음":
                continue

            # 상품번호 및 옵션번호
            option_span = item.select_one("span.txt")
            option_name = option_span.get_text(
                strip=True) if option_span else "내용 없음"
            oliveyoung_id_of_option, option_id = optgoodsinfo.split(":")

            option_id = int(option_id.lstrip(
                "0")) if option_id.isdigit() else 1

            cosmetic.option_name = option_name
            cosmetic.oliveyoung_id = oliveyoung_id_of_option
            cosmetic.option_id = option_id

            image_src = item.select_one("img").get("src")
            cosmetic.image_url3 = upload_image_to_s3(image_src)

            try:
                selector = driver.find_element(
                    By.CSS_SELECTOR, f"li[optgoodsinfo='{optgoodsinfo}'] a.item")
                driver.execute_script("arguments[0].click();", selector)
                time.sleep(1)
            except:
                logger.info("selector not found", optgoodsinfo)
                break

            soup = BeautifulSoup(driver.page_source, "html.parser")
            crawl_one_cosmetic_review(cosmetic, soup, driver)
    return


def crawl_one_cosmetic_review(cosmetic: Cosmetic,  soup: BeautifulSoup, driver: webdriver):
    reviews = []
    cosmetic_id = insert_cosmetic_from_object(cosmetic)
    parse_ingredient_by_cosmetic_id(cosmetic.cosmetic_id, cosmetic_id)

    page_block = 0
    # 리뷰가 10페이지가 넘어갈 때
    while has_next_page(soup):
        reviews.extend(collect_reviews_from_page(soup))
        for i in range(2, 10):
            if not click_review_page(driver, page_block * 10 + i):
                break
            soup = BeautifulSoup(driver.page_source, "html.parser")
            reviews.extend(collect_reviews_from_page(soup))
        if not click_next(driver):
            break
        soup = BeautifulSoup(driver.page_source, "html.parser")
        page_block += 1

        # if page_block % 1000 == 0:
        #     # 하둡에 리퀘스트
        #     logger.info(cosmetic_id, "-", review_strings)
        #     data = {
        #         "cosmetic_id": cosmetic_id,
        #         "reviews": review_strings
        #     }
        #     response = requests.post(
        #         "http://localhost:5000/analyze/crawl", json=data)
        #     logger.info(response)
        #     review_strings = []

    for i in range(page_block * 10 + 2, page_block * 10 + 10):
        reviews.extend(collect_reviews_from_page(soup))
        if not click_review_page(driver, i):
            break
        soup = BeautifulSoup(driver.page_source, "html.parser")

    # 하둡에 리퀘스트
    logger.info("cosmetic_id: %s reviews_len: %s",
                cosmetic_id, len(reviews))
    # data = {
    #     "cosmetic_id": cosmetic_id,
    #     "reviews": review_strings,
    #     "is_last_batch": True
    # }
    # response = requests.post(
    #     "http://j12a507a.ssafy.io:5000/analyze/crawl", json=data)
    # logger.info(response)
    # cosmetic_id

    insert_cosmetic_reviews(cosmetic_id, reviews)
    return reviews


def has_next_page(soup: BeautifulSoup):
    return bool(soup.select_one("a.next"))


def click_review_page(driver: webdriver, page_no: int):
    try:
        page_btn = driver.find_element(
            By.CSS_SELECTOR, f"a[data-page-no='{page_no}']")
        ActionChains(driver).move_to_element(page_btn).click().perform()
        time.sleep(1)
        return True
    except:
        return False


def click_next(driver: webdriver):
    try:
        next_btn = driver.find_element(By.CSS_SELECTOR, "a.next")
        driver.execute_script("arguments[0].click();", next_btn)
        time.sleep(1)
        return True
    except:
        return False


def collect_reviews_from_page(soup: BeautifulSoup):
    review_list = soup.select("ul#gdasList>li")
    return [item.select_one("div.txt_inner").get_text(strip=True) for item in review_list if item.select_one("div.txt_inner")]


# logger.info(crawl_reviews("A000000219657"))
