from crawler.product_crawler import crawl_product_detail


def digit(num):
    for i in range(7):
        if num//(10**i) < 1:
            break
    return i


# (a, b)  a부터 b까지  (b, a, -1) b부터 a 까지
for i in range(212391, 220000):
    d = digit(i)
    no = "A000000"+"0"*(6-d)+str(i)
    print(no)
    crawl_product_detail(no)
