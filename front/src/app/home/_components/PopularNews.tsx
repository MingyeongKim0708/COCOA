import T3 from "@/app/_components/common/T3";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  thumbnail: string;
  link: string;
  publishedAt: string;
}

const newsData = [
  {
    title: "화장품 바르는 것 외 피부 고민별 피부 관리 방법",
    thumbnail:
      "https://postfiles.pstatic.net/MjAyNTAxMTNfMjI0/MDAxNzM2NzU1ODUyNDQz.YxCRwFoDLGJQAGdlyeoy-1as2Al3KrAc4JykB3H4O7Ag.Cv9mG2ViEl9G-vgZaFdE0J9Bu74bgONECLqVxRZELs8g.JPEG/SE-e361729e-bf80-457e-ac7e-6f3a6e6a1d21.jpg?type=w966",
    link: "https://blog.naver.com/rincyan/223821785937?isInf=true",
    publishedAt: "2025-04-06",
  },
  {
    title: "미백광채앰플 브이앤에이 로즈펩타이드앰플로 맑은 피부 찾았어요",
    thumbnail:
      "https://postfiles.pstatic.net/MjAyNTA0MDZfMTg2/MDAxNzQzOTE4NDE2OTI5.Wog9Z4bQEo73h_KYyCTe1DzK9INYOrr2tvfb9XX5akMg.S8sZm25f6hKhXUrP80BOqeetCfXogj81_7SB1mOBjXUg.JPEG/DSC04965.JPG?type=w966",
    link: "https://blog.naver.com/qmffn06/223823890508?isInf=true&trackingCode=naver_etc",
    publishedAt: "2025-04-10",
  },
];

export default function PopularNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  useEffect(() => {
    setNews(newsData);
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
