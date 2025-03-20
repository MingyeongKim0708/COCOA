from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.action_chains import ActionChains
import time
from bs4 import BeautifulSoup

from db import insert_cosmetic, is_in_child_cosmetic, insert_same_cosmetic, update_same_cosmetic, insert_ingredient_text


def get_cosemtic_ingredient(soup: BeautifulSoup):
    product_ingredient = ""
    for dl in soup.select("dl.detail_info_list"):
        dt = dl.select_one("dt")

        if dt and "내용물의 용량 또는 중량" in dt.get_text(strip=True):
            dd = dl.select_one("dd")
            product_name = dd.get_text(strip=True) if dd else "상품명 없음"

        if dt and "화장품법에 따라 기재해야 하는 모든 성분" in dt.get_text(strip=True):
            dd = dl.select_one("dd")
            product_ingredient = dd.get_text(strip=True) if dd else "성분 정보 없음"
            break

    product_ingredient_by_option = product_ingredient.split("[")

    dictionary = {}
    index = 0
    for ingredient_string in product_ingredient_by_option:
        if len(ingredient_string) < 1 and len(ingredient_string.split(",")) <= 1:
            continue
        [option, ingredient_string_by_option] = (
            ingredient_string.split("]") + [None])[:2]
        if ingredient_string_by_option == None:
            ingredient_string_by_option = option
            option = "nooption"
        else:
            # 옵션이름이 없거나 무효할 경우우
            if len(ingredient_string_by_option) <= 1:
                ingredient_string_by_option = option
                option = "blank"+str(index)
                index += 1

        ingredients = ingredient_string_by_option.strip(",").split(",")
        dictionary_value = ""

        for ingredient in ingredients:

            # 이상한 이름 거르기
            if ingredient == "1" or ingredient == " 1" or ingredient == "2" or ingredient == " 2" or ingredient == "2-올레아미도-1":
                continue
            elif ingredient == "2-헥산다이올":
                ingredient = "1,2-헥산다이올"
            elif ingredient == "3-다이아미노프로판다이말리에이트":
                ingredient = "1,3-다이아미노프로판다이말리에이트"
            elif ingredient == "4-트라이하이드록시벤젠":
                ingredient = "1,2,4-트라이하이드록시벤젠"
            elif ingredient == "6-헥산트라이올":
                ingredient = "1,2,6-헥산트라이올"
            elif ingredient == "10-데칸다이올":
                ingredient = "1,10-데칸다이올"
            elif ingredient == "2'-티오비스":
                ingredient = "2,2'-티오비스"
            elif ingredient == "2'-메틸렌비스4-아미노페놀":
                ingredient = "2,2'-메틸렌비스4-아미노페놀"
            elif ingredient == "3-부탄다이올":
                ingredient = "2,3-부탄다이올"
            elif ingredient == "6-다이메틸-7-옥텐-2-올":
                ingredient = "2,6-다이메틸-7-옥텐-2-올"
            dictionary_value += ingredient.strip()+"_"

        dictionary[option] = dictionary_value[:len(dictionary_value)-1]

    return product_name, dictionary


def get_reputations(soup: BeautifulSoup):
    reputations = [None]*4
    poll_all = soup.select("div.poll_all>dl")

    index = 0
    for poll in poll_all:
        poll_text = poll.select_one("dt span").get_text()
        poll_li = poll.select("li")

        # % 값이 가장 높은 li 찾기
        max_li = max(poll_li, key=lambda li: int(
            li.select_one("em.per")["data-value"]))

        # 해당 li의 텍스트 가져오기
        best_text = max_li.select_one("span.txt").get_text(strip=True)
        reputations[index] = poll_text+":"+best_text
        index += 1

    print(reputations)

    return reputations


def do_crawl(oliveyoung_id):
    if is_in_child_cosmetic(oliveyoung_id):
        print("already has it")
        return

    global soup
    url = f"https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo={oliveyoung_id}"

    # Selenium WebDriver 설정 (ChromeDriver 자동 다운로드)
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # 백그라운드에서 실행
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    # WebDriver 실행
    driver = webdriver.Chrome(service=service, options=options)
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
    # 상품 제조사 가져오기기
    product_producer = soup.select_one("a#moveBrandShop").get_text(
        strip=True) if soup.select_one("a#moveBrandShop") else "상품명 없음"
    # 카테고리명 가져오기
    product_category = soup.select_one("#recoBellDispCatNo").get(
        "value") if soup.select_one("#recoBellDispCatNo") else "카테고리리 없음"

    # 현재 공식 상품명, 성분 가져오기
    official_name, product_ingredient = get_cosemtic_ingredient(soup)

    # 명칭 합치기
    product_name += official_name

    # 상품 평판 가져오기
    reputations = get_reputations(soup)

    # 결과 출력
    print(f"상품명: {product_name}")
    print(f"브랜드명: {product_producer}")
    print(f"카테고리리명: {product_category}")

    # 모든 옵션 가져오기
    items = soup.select("ul.sel_option_list>li") if soup.select(
        "ul.sel_option_list>li") else None

    review_amount = int(soup.select_one(
        "div.star_area>p.total>em").get_text(strip=True).replace(",", ""))
    page_cosmetic_id = insert_cosmetic(oliveyoung_id, product_name, "page",
                                       product_producer, product_category, reputations, review_amount, 0)

    if items == None:
        service
        review_amount = int(soup.select_one(
            "div.star_area>p.total>em").get_text(strip=True).replace(",", ""))

        cosmetic_id = insert_cosmetic(oliveyoung_id, product_name, "nooption",
                                      product_producer, product_category, reputations, review_amount)

        insert_same_cosmetic(oliveyoung_id, oliveyoung_id, cosmetic_id)

    else:
        for item in items:
            optgoodsinfo = item.get("optgoodsinfo", "없음")  # 상품번호 및 아이템번호
            if optgoodsinfo == "없음":
                continue

            option_span = item.select_one("span.txt")
            option_name = option_span.get_text(
                strip=True) if option_span else "내용 없음"
            review_amount_span = item.select_one("span.num em.txt_en")
            review_amount = review_amount_span.get_text(
                strip=True) if review_amount_span else "숫자 없음"

            [child_oliveyoung_id, option_id] = optgoodsinfo.split(":")
            option_id = int(option_id.lstrip(
                "0")) if option_id.isdigit() else 1

            if is_in_child_cosmetic(child_oliveyoung_id, option_id):
                update_same_cosmetic(oliveyoung_id, child_oliveyoung_id)
            else:
                cosmetic_id = insert_cosmetic(child_oliveyoung_id, product_name, option_name,
                                              product_producer, product_category, reputations, review_amount, option_id)
                insert_same_cosmetic(
                    oliveyoung_id, child_oliveyoung_id, cosmetic_id, option_id)

            # # 확인용 출력력
            print(f"상품 코드: {child_oliveyoung_id}, {option_id}")
            # print(f"상품명: {title}")
            # print(f"옵션: {option_name}")
            # print(f"리뷰 수: {review_amount}")
            # print("-" * 50)

    insert_ingredient_text(page_cosmetic_id, product_ingredient)

    print(product_ingredient)

    # WebDriver 종료
    driver.quit()


do_crawl("A000000219097")
