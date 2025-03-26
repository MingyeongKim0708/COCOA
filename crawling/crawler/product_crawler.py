import logging
from db.cosmetic_dao import (insert_cosmetic_from_fields, is_in_child_cosmetic,
                             insert_same_cosmetic, update_same_cosmetic)
from db.ingredient_dao import insert_ingredient_text
from driver import create_driver
from bs4 import BeautifulSoup
import time
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium import webdriver

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def safe_select_text(soup, selector, default=""):
    el = soup.select_one(selector)
    return el.get_text(strip=True) if el else default


def get_cosemtic_ingredient(soup: BeautifulSoup):
    product_ingredient = None
    product_info = None
    for dl in soup.select("dl.detail_info_list"):
        dt = dl.select_one("dt")

        if dt:
            dt_text = dt.get_text(strip=True)
            if "내용물의 용량 또는 중량" in dt_text:
                product_info = safe_select_text(dl, "dd", "상품명 없음")
            elif "화장품법에 따라 기재해야 하는 모든 성분" in dt_text:
                product_ingredient = safe_select_text(dl, "dd", "성분 정보 없음")
                break

    if product_ingredient == None:
        return None, None

    dictionary = {}
    index = 0
    for ingredient_string in product_ingredient.split("["):
        if len(ingredient_string) < 1 and len(ingredient_string.split(",")) <= 1:
            continue
        [option, ingredient_string_by_option] = (
            ingredient_string.split("]") + [None])[:2]
        if ingredient_string_by_option == None:
            ingredient_string_by_option = option
            option = "nooption"
        else:
            # 옵션이름이 없거나 무효할 경우
            if len(ingredient_string_by_option) <= 1:
                ingredient_string_by_option = option
                option = "blank"+str(index)
                index += 1

        ingredients = ingredient_string_by_option.strip(",").split(",")
        dictionary_value = ""

        for ingredient in ingredients:
            # 이상한 이름 거르기 없어짐 - ingredient.py에 남겨놓았음
            dictionary_value += ingredient.strip()+"_"

        dictionary[option] = dictionary_value[:len(dictionary_value)-1]

    return product_info, dictionary


def get_reputations(soup: BeautifulSoup):
    reputations = [None]*4
    polls = soup.select("div.poll_all>dl")

    for idx, poll in enumerate(polls[:4]):
        poll_text = poll.select_one("dt span").get_text()
        li_list = poll.select("li")

        # % 값이 가장 높은 li 찾기
        max_li = max(li_list, key=lambda li: int(
            li.select_one("em.per")["data-value"]))

        # 해당 li의 텍스트 가져오기
        best_text = max_li.select_one("span.txt").get_text(strip=True)
        reputations[idx] = poll_text+":"+best_text

    # logger.info(reputations)

    return reputations


def crawl_product_detail(oliveyoung_id):
    if is_in_child_cosmetic(oliveyoung_id):
        logger.info("already has it")
        return

    url = f"https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo={oliveyoung_id}"

    # WebDriver 실행
    driver = create_driver()
    driver.get(url)
    # 페이지 로딩 대기
    time.sleep(2)

    # 상세정보 탭 클릭 (안전하게 시도) - 실패한다면 없는 페이지로 간주하여 return
    for tab_selector in ["a.goods_buyinfo", "a.goods_reputation"]:
        try:
            tab = driver.find_element(By.CSS_SELECTOR, tab_selector)
            ActionChains(driver).move_to_element(tab).click().perform()
            time.sleep(1)
        except:
            return

    # 페이지 소스를 가져와 BeautifulSoup으로 파싱
    soup = BeautifulSoup(driver.page_source, "html.parser")

    # 상품명 가져오기
    product_name = soup.select_one("p.prd_name").get_text(
        strip=True) if soup.select_one("p.prd_name") else "상품명 없음"
    # 상품 제조사 가져오기
    product_producer = soup.select_one("a#moveBrandShop").get_text(
        strip=True) if soup.select_one("a#moveBrandShop") else "상품명 없음"
    # 카테고리명 가져오기
    product_category = soup.select_one("#recoBellDispCatNo").get(
        "value") if soup.select_one("#recoBellDispCatNo") else "카테고리리 없음"

    # 현재 공식 상품명, 성분 가져오기
    product_info, product_ingredient = get_cosemtic_ingredient(soup)

    # 성분이 없다면 화장품이 아님
    if product_ingredient == None:
        driver.quit()
        return

    # 명칭 합치기
    if product_info:
        product_name += product_info

    # 상품 평판 가져오기
    reputations = get_reputations(soup)

    # 결과 출력
    logger.info(
        f"상품명: {product_name} \n브랜드명: {product_producer} \n카테고리리명: {product_category} \n{reputations}")

    review_amount = int(safe_select_text(
        soup, "div.star_area > p.total > em", "0").replace(",", ""))

    page_cosmetic_id = insert_cosmetic_from_fields(oliveyoung_id, product_name, "page",
                                                   product_producer, product_category, reputations, review_amount, 0)

    # 모든 옵션 가져오기
    items = soup.select("ul.sel_option_list>li")

    if not items:
        cosmetic_id = insert_cosmetic_from_fields(oliveyoung_id, product_name, "nooption",
                                                  product_producer, product_category, reputations, review_amount)

        insert_same_cosmetic(oliveyoung_id, oliveyoung_id, cosmetic_id)

    else:
        for item in items:
            opt_info = item.get("optgoodsinfo", "없음")  # 상품번호 및 아이템번호
            if opt_info == "없음":
                continue

            option_name = safe_select_text(item, "span.txt", "내용 없음")
            review_amount_text = safe_select_text(
                item, "span.num em.txt_en", "0")
            review_amount = int(review_amount_text.replace(
                ",", "")) if review_amount_text.isdigit() else 0

            try:
                child_id, opt_id = opt_info.split(":")
                opt_id = int(opt_id.lstrip("0")) or 1
            except:
                continue

            if is_in_child_cosmetic(child_id, opt_id):
                update_same_cosmetic(oliveyoung_id, child_id)
            else:
                cosmetic_id = insert_cosmetic_from_fields(child_id, product_name, option_name,
                                                          product_producer, product_category, reputations, review_amount, opt_id)
                insert_same_cosmetic(
                    oliveyoung_id, child_id, cosmetic_id, opt_id)

            # # 확인용 출력력
            logger.info(
                f"상품 코드: {child_id}, {opt_id}\n옵션: {option_name}\n리뷰 수: {review_amount}")
            # logger.info("-" * 50)

    insert_ingredient_text(page_cosmetic_id, product_ingredient)

    # logger.info(product_ingredient)

    # WebDriver 종료
    driver.quit()


# logger.info(do_crawl("A000000219657"))
