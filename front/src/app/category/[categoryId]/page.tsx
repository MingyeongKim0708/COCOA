"use client";
import React, { useCallback, useRef } from "react";

import ProductCard from "@/app/_components/product/ProductCard";
import PageHeader from "@/app/_components/common/PageHeader";
import ScrollToTopButton from "@/app/_components/common/ScrollToTopButton";
import { dummyProducts } from "@/mocks/dummyProducts";
import T3 from "@/app/_components/common/T3";
import { useUserStore } from "@/stores/UserStore";
import { useParams, useSearchParams } from "next/navigation";
import { Cosmetic } from "@/types/cosmetic";
import { useState, useEffect } from "react";
import { fetchWrapper } from "@/lib/fetchWrapper";
import Toggle from "@/app/_components/common/Toggle";

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = Number(params?.categoryId);
  const { user } = useUserStore();
  const [cosmetics, setCosmetics] = useState<Cosmetic[] | null>(null);
  const [allCosmetics, setAllCosmetics] = useState<Cosmetic[]>([]); // 전체 제품용
  const [isCustomMode, setIsCustomMode] = useState(true); // 기본: 맞춤 추천

  const searchParams = useSearchParams();
  const majorCategory = searchParams.get("major");
  const middleCategory = searchParams.get("middle");

  // 무한 스크롤
  const [lastId, setLastId] = useState<number | null>(null); // cursor
  const [hasNext, setHasNext] = useState(true); // 다음 페이지 존재 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 중인지

  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);

  // console.log("categoryId:", categoryId); // 확인용
  // console.log("API 요청 URL:", `/category/${categoryId}/custom`);
  // console.log("API URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  // console.log("Product in map:", products);

  useEffect(() => {
    const fetchCustomCosmetics = async () => {
      const res = await fetchWrapper(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}/custom`,
      );
      const json = await res.json();
      const status = json.data.status;

      if (status === "processing") {
        // 추천 중 로딩 메세지 표시
        setIsRecommendationLoading(true);
        setCosmetics(null);
      } else if (status === "ready") {
        setIsRecommendationLoading(false);
        setCosmetics(json.data.data); // 실제 추천 결과 리스트
      }
    };

    const fetchAllCosmetics = async () => {
      const res = await fetchWrapper(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}`,
      );
      const json = await res.json();
      setAllCosmetics(json.data.data);
    };

    if (categoryId && user?.id) {
      fetchCustomCosmetics();
      fetchAllCosmetics();
    }
  }, [categoryId, user?.id]);

  const fetchMoreAllCosmetics = async () => {
    if (isLoading || !hasNext) return;

    setIsLoading(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/category/${categoryId}?size=20${lastId ? `&lastId=${lastId}` : ""}`;

    try {
      const res = await fetchWrapper(url);
      const json = await res.json();

      const newData: Cosmetic[] = json.data.data;
      const nextCursor: number | null = json.data.nextCursor;
      const hasNextPage: boolean = json.data.hasNext;

      // setAllCosmetics((prev) => [...prev, ...newData]);
      setAllCosmetics((prev) => {
        const prevIds = new Set(prev.map((c) => c.cosmeticId));
        const filtered = newData.filter((c) => !prevIds.has(c.cosmeticId));
        return [...prev, ...filtered];
      });
      setLastId(nextCursor);
      setHasNext(hasNextPage);
    } catch (e) {
      console.error("무한스크롤 요청 에러:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          fetchMoreAllCosmetics(); // 스크롤 끝에 도달하면 추가 로딩
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasNext],
  );

  const handleToggle = async () => {
    const next = !isCustomMode;
    setIsCustomMode(next);

    if (next) {
      // ✅ 맞춤 추천 다시 fetch
      setIsRecommendationLoading(true);
      const res = await fetchWrapper(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}/custom`,
      );
      const json = await res.json();
      const status = json.data.status;

      if (status === "processing") {
        setCosmetics(null);
      } else if (status === "ready") {
        setCosmetics(json.data.data);
      }
      setIsRecommendationLoading(false);
    } else {
      // ✅ 전체 제품 다시 fetch (관심제품 반영된 상태로)
      const res = await fetchWrapper(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}`,
      );
      const json = await res.json();
      setAllCosmetics(json.data.data);
    }
    // setIsCustomMode((prev) => !prev);
  };

  return (
    <>
      <PageHeader
        title={
          <>
            <span>{majorCategory}</span>
            <span className="text-gray4"> / </span>
            <span>{middleCategory}</span>
          </>
        }
        showBackButton
      />
      <div className="flex flex-row justify-between p-2">
        <div className="flex h-[2rem] flex-row items-center gap-1">
          {isCustomMode ? (
            <>
              <T3 children={`${user?.nickname}`} className="text-red2" />
              <T3 children="님에게 맞는 제품" />
            </>
          ) : (
            <>
              <T3 children={`${middleCategory}`} className="text-red2" />
              <T3 children="전체 제품" />
            </>
          )}
        </div>
        <Toggle isOn={isCustomMode} onToggle={handleToggle} />
      </div>
      {isCustomMode ? (
        cosmetics === null ? (
          isRecommendationLoading ? (
            <p className="pt-4 text-center text-gray2">
              당신에게 잘 맞는 제품을 찾는 중이에요🔍
              <br />
              조금만 기다려주세요!
            </p>
          ) : (
            <p className="pt-4 text-center text-gray2">
              당신에게 잘 맞는 제품을 찾는 중이에요🔍
            </p>
          )
        ) : cosmetics.length === 0 ? (
          <p className="pt-4 text-center text-gray2">
            아직 사용자 맞춤 키워드가 없어 <br />
            추천할 수 있는 제품이 없어요 😢
          </p>
        ) : (
          <div className="grid grid-cols-2 place-items-center gap-2">
            {cosmetics.map((cosmetic) => (
              <ProductCard cosmetic={cosmetic} key={cosmetic.cosmeticId} />
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 place-items-center gap-2">
          {allCosmetics.map((cosmetic, index) => {
            const isLast = index === allCosmetics.length - 1;
            return (
              <div
                key={`${cosmetic.cosmeticId}-${index}`}
                ref={isLast ? loadMoreRef : null}
              >
                <ProductCard cosmetic={cosmetic} />
              </div>
            );
          })}
        </div>
      )}

      <ScrollToTopButton />
    </>
  );
}
