import T3 from "@/app/_components/common/T3";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  thumbnail: string;
  link: string;
  publishedAt: string;
}

const NEWS_CACHE_KEY = "cachedNews";
const NEWS_CACHE_DATE_KEY = "cachedNewsDate";

// 더미 데이터
const dummyNews = [
  {
    title: "화장품 바르는 것 외 피부 고민별 피부 관리 방법",
    thumbnail:
      "https://mblogthumb-phinf.pstatic.net/MjAyNTA0MDRfMjEx/MDAxNzQzNzY5MjgwMDUz.En5lVhHYZXiyTAtkhAj_WK2pOws4Tj_2qjmz0O_r8kUg.QGPj34Md442tXuH9bZkxXrslae4IhgeietttKvbtwbAg.JPEG/IMG_2025.JPG?type=w800",
    link: "https://blog.naver.com/rincyan/223821785937?isInf=true",
    publishedAt: "2025-04-06",
  },
  {
    title: "율영세일 니들리 토너 패드, 모공관리와 각질케어까지 후기!",
    thumbnail:
      "https://mblogthumb-phinf.pstatic.net/MjAyNTAzMzBfMjA3/MDAxNzQzMzM5NTc1NjU5.i2sEYt3Nsc6Nq2PGR8rE34JR0Chvwbi5XCZhL4a2gYog.1EDiTXA3b7FOp1Sb_fSC78-JyhU04w9-DIkc7JkWDAEg.JPEG/%25BA%25B8%25BD%25C0_%25C0%25E5%25BA%25AE_%25C5%25A9%25B8%25B2.JPG?type=w800",
    link: "https://blog.naver.com/qmffn06/223823890508?isInf=true&trackingCode=naver_etc",
    publishedAt: "2025-04-06",
  },
];

export default function PopularNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // "2025-04-06"

    const cachedDate = localStorage.getItem(NEWS_CACHE_DATE_KEY);
    const cachedNews = localStorage.getItem(NEWS_CACHE_KEY);

    if (cachedDate === today && cachedNews) {
      // - 오늘 저장된 뉴스가 있다면 사용
      setNews(JSON.parse(cachedNews));
    } else {
      // - 오늘 처음이거나 캐시 없음 → API 호출
      //   fetchWrapper("/api/news")
      //     .then((res) => res.json())
      //     .then((data: NewsItem[]) => {
      //       setNews(data);
      //       localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(data));
      //       localStorage.setItem(NEWS_CACHE_DATE_KEY, today);
      //     });
      setNews(dummyNews);
      localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(dummyNews));
      localStorage.setItem(NEWS_CACHE_DATE_KEY, today);
    }
  }, []);

  return (
    <section className="pb-5">
      <T3 className="pb-3">인기 소식을 확인해보세요!</T3>
      <div className="flex w-full gap-1">
        {news.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[calc(50%-2px)] shrink-0"
          >
            <div className="mb-1 aspect-[4/3] w-full overflow-hidden rounded-lg">
              <img
                src={item.thumbnail}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="truncate text-size4 font-body text-gray2">
              {item.title}
            </div>
            <div className="mt-1 text-size6 text-gray3">
              {new Date(item.publishedAt).toLocaleDateString("ko-KR")}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
