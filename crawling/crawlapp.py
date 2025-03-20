from crawler import do_crawl


def digit(num):
    for i in range(7):
        if num//(10**i) < 1:
            break
    return i


for i in range(40, 1000):
    d = digit(i)
    no = "A000000"+"0"*(6-d)+str(i)
    do_crawl(no)
