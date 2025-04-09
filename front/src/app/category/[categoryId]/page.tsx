"use client";
import React from "react";

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
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [allCosmetics, setAllCosmetics] = useState<Cosmetic[]>([]); // 전체 제품용
  const [isCustomMode, setIsCustomMode] = useState(true); // 기본: 맞춤 추천

  const searchParams = useSearchParams();
  const majorCategory = searchParams.get("major");
  const middleCategory = searchParams.get("middle");

  // console.log("categoryId:", categoryId); // 확인용
  // console.log("API 요청 URL:", `/category/${categoryId}/custom`);
  // console.log("API URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  // console.log("Product in map:", products);

  useEffect(() => {
    const fetchCustomCosmetics = async () => {
      const res = await fetchWrapper(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}/custom`,
      );
      const data = await res.json();
      setCosmetics(data);
    };

    const fetchAllCosmetics = async () => {
      const res = await fetchWrapper(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}`,
      );
      const data = await res.json();
      setAllCosmetics(data.data);
    };

    if (categoryId && user?.id) {
      fetchCustomCosmetics();
      fetchAllCosmetics();
    }
  }, [categoryId, user?.id]);

  const handleToggle = () => {
    setIsCustomMode((prev) => !prev);
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
              <T3 children={`${user.nickname}`} className="text-red2" />
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
        cosmetics.length === 0 ? (
          <p className="pt-4 text-center text-gray2">
            아직 사용자 맞춤 키워드가 없어 <br />
            추천할 수 있는 제품이 없어요 😢
          </p>
        ) : (
          <div className="grid grid-cols-2 place-items-center gap-2">
            {cosmetics.map((cosmetic) => {
              // console.log("화장품 정보:", cosmetic);
              return (
                <ProductCard cosmetic={cosmetic} key={cosmetic.cosmeticId} />
              );
            })}
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 place-items-center gap-2">
          {allCosmetics.map((cosmetic) => (
            <ProductCard cosmetic={cosmetic} key={cosmetic.cosmeticId} />
          ))}
        </div>
      )}

      <ScrollToTopButton />
    </>
  );
}
