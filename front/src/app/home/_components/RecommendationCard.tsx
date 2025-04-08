import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import T3 from "@/app/_components/common/T3";
import Tag from "@/app/_components/common/Tag";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface RecommendedCosmetics {
  cosmeticId: number;
  imageUrl: string;
  keywordList: string[];
}

const cosmetics: RecommendedCosmetics[] = [
  {
    cosmeticId: 1,
    imageUrl: "/images/A00000013216229ko.jpg",
    keywordList: ["수분", "촉촉", "진정"],
  },
  {
    cosmeticId: 2,
    imageUrl: "/images/A00000015861604ko.jpg",
    keywordList: ["광채", "가볍게", "톤업"],
  },
  {
    cosmeticId: 3,
    imageUrl: "/images/A00000017358912ko.jpg",
    keywordList: ["보습", "탄력", "영양"],
  },
];

export function RecommendationCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_: number, next: number) => {
      setCurrentIndex(next);
    },
  };

  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageHeight, setImageHeight] = useState<number>(0);

  useEffect(() => {
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight);
    }
  }, [currentIndex]); // 슬라이드가 바뀔 때 다시 측정

  return (
    <section className="pb-5">
      <div className="inline-flex gap-2 pb-3">
        <T3>이 </T3>
        <T3>"최근 본 카테고리"</T3>
        <T3> 제품은 어떠신가요?</T3>
      </div>

      <div className="flex justify-between">
        {/* 왼쪽: 제품 이미지 */}
        <div className="relative flex w-[55%]">
          <div className="w-full">
            <Slider ref={sliderRef} {...settings}>
              {cosmetics.map((item) => (
                <div key={item.cosmeticId}>
                  <img
                    src={item.imageUrl}
                    alt="추천 제품"
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>

          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="absolute left-[0.2rem] top-1/2 -translate-y-1/2 text-gray5 active:text-gray3"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="absolute right-[0.2rem] top-1/2 -translate-y-1/2 text-gray5 active:text-gray3"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* 오른쪽: COCOA's PICK PNG + 태그 */}
        <div className="flex w-[43%] flex-col items-center justify-between">
          <div className="w-full pb-2">
            <img
              src="/images/cocoas_pick.png"
              alt="Cocoa's Pick"
              className="w-full"
            />
          </div>

          <div className="flex h-full w-[80%] flex-col items-center gap-2 self-end">
            {cosmetics[currentIndex].keywordList.map((kw, i) => (
              <Tag
                key={i}
                className="flex h-1/3 w-full items-center justify-center bg-pink1 text-white"
              >
                {kw}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
