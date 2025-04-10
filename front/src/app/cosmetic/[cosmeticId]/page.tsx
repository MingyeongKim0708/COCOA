"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/app/_components/common/PageHeader";
import CosmeticInfo from "./_components/CosmeticInfo";
import CosmeticWordCloud from "@/app/_components/wordcloud/CosmeticWordCloud";
import ScrollToTopButton from "@/app/_components/common/ScrollToTopButton";
import WriteReviewButton from "./_components/WriteReviewButton";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { Cosmetic } from "@/types/cosmetic";
import { Review } from "@/types/review";
import { CosmeticDetail } from "@/types/cosmeticDetail";
import ToggleSwitch from "./_components/ToggleSwitch";

export default function CosmeticDetailPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const params = useParams();
  const cosmeticId = Number(params.cosmeticId);

  const [cosmetic, setCosmetic] = useState<Cosmetic | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectWord, setSelectWord] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchAllReviews = async () => {
    try {
      const res = await fetchWrapper(
        `${baseUrl}/reviews?cosmeticId=${cosmeticId}&page=0`,
      );
      const data: Review[] = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("리뷰 불러오기 실패", err);
    }
  };

  const fetchFilteredReviews = async (keyword: string) => {
    try {
      const res = await fetchWrapper(
        `${baseUrl}/reviews?cosmeticId=${cosmeticId}&keyword=${encodeURIComponent(keyword)}&page=0`,
      );
      const data: Review[] = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("리뷰 불러오기 실패", err);
    }
  };

  const handleSelectWord = (word: string) => {
    if (selectWord === word) {
      setSelectWord(null);
      setIsFiltered(false);
      fetchAllReviews();
      return;
    }

    setSelectWord(word);
    setIsFiltered(false);
    fetchFilteredReviews(word);
  };

  const handleToggle = () => {
    if (selectWord) {
      setSelectWord(null);
      setIsFiltered(true);
      fetchAllReviews();
      return;
    }
    setIsFiltered((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWrapper(`${baseUrl}/cosmetics/${cosmeticId}`);
        const resJson = await res.json();
        const data: CosmeticDetail = resJson.data;
        setCosmetic(data.cosmetic);
        setReviews(data.reviews);
      } catch (e) {
        console.error("화장품 정보 불러오기 실패", e);
      }
    };

    fetchData();
  }, [cosmeticId]);

  if (!cosmetic) {
    return (
      <div className="relative mx-[-1.25rem] flex h-full flex-col items-center justify-center text-center text-size2 text-gray1">
        상품 정보를 불러오고 있어요...
        <img
          src="/melong_landing.png"
          alt="melong"
          className="absolute bottom-0 z-[-1]"
        />
      </div>
    );
  }

  return (
    <div className="mx-[-1.25rem]">
      <PageHeader title="제품 상세" showBackButton />
      <img src={cosmetic.images[0]} alt={cosmetic.name} className="w-full" />
      <div className="mx-5">
        <CosmeticInfo cosmetic={cosmetic} />
        <div className="mb-4 mt-8 text-size3 font-bold">제품 키워드</div>
        <div className="mx-auto w-fit">
          <CosmeticWordCloud
            words={cosmetic.keywords}
            onWordClick={handleSelectWord}
            selectWord={selectWord}
            isFiltered={isFiltered}
          />
        </div>
        <div className="mt-4 flex items-center justify-end text-size4 font-bold text-gray2">
          <label className="flex cursor-pointer items-center gap-2">
            <span>나와 겹치는 키워드 확인하기</span>
            <ToggleSwitch checked={isFiltered} onChange={handleToggle} />
          </label>
        </div>
        <div className="mt-10 text-size4 text-gray4">
          <p>키워드를 클릭해 나에게 맞는 리뷰를 확인해 보세요.</p>
          <p>
            제품 관련 키워드를 수집하여 제공하는 것으로, COCOA에서는 관련 리뷰가
            존재하지 않을 수 있습니다.
          </p>
        </div>
        <WriteReviewButton cosmeticId={cosmetic.cosmeticId} />
        <ScrollToTopButton />
      </div>
    </div>
  );
}
