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
import T5 from "@/app/_components/common/T5";
import T3 from "@/app/_components/common/T3";
import InfoHint from "./_components/InfoHint";
import CosmeticReviewList from "@/app/_components/review/CosmeticReviewList";

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
        `${baseUrl}/reviews/cosmetic/{cosmeticId}?page=0`,
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
        `${baseUrl}/reviews/cosmetic/{cosmeticId}?page=0&keyword=${keyword}`,
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
      fetchAllReviews();
    } else {
      setSelectWord(word);
      fetchFilteredReviews(word);
    }
  };

  const handleToggle = () => {
    setIsFiltered((prev) => !prev);
  };

  useEffect(() => {}, [isFiltered]);
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
      <div className="px-5">
        <CosmeticInfo cosmetic={cosmetic} />
        <div className="flex flex-row items-center justify-between gap-2 pb-4 pt-8">
          <T3>제품 키워드</T3>
          <InfoHint />
        </div>
        <div className="px-auto w-full">
          <CosmeticWordCloud
            words={cosmetic.keywords}
            onWordClick={handleSelectWord}
            selectWord={selectWord}
            isFiltered={isFiltered}
          />
        </div>
        <div className="flex items-center justify-end pt-4 text-size4 font-title text-gray2">
          <label className="flex cursor-pointer items-center gap-2">
            <span>나와 겹치는 키워드 확인하기</span>
            <ToggleSwitch checked={isFiltered} onChange={handleToggle} />
          </label>
        </div>
        <T5 className="text-right text-gray4">
          키워드를 클릭해 나에게 맞는 리뷰를 확인해 보세요.
        </T5>
        <CosmeticReviewList reviews={reviews} selectWord={selectWord} />
        <div className="pt-10 text-gray4"></div>
        <WriteReviewButton cosmeticId={cosmetic.cosmeticId} />
        <ScrollToTopButton />
      </div>
    </div>
  );
}
