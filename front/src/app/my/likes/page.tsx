"use client";

import PageHeader from "@/app/_components/common/PageHeader";
import T2 from "@/app/_components/common/T2";
import ProductCard from "@/app/_components/product/ProductCard";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { useUserStore } from "@/stores/UserStore";
import { Cosmetic } from "@/types/cosmetic";
import { User } from "@/types/user";
import React, { useEffect, useState } from "react";

export default function LikesPage() {
  const { user } = useUserStore();
  const [likedCosmetic, setLikedCosmetic] = useState<Cosmetic[] | null>();
  useEffect(() => {
    const fetchLiked = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetchWrapper(`${baseUrl}/cosmetic/likes`, {
        credentials: "include",
      });
      if (res.ok) {
        const resJson = await res.json();
        const cosmetics: Cosmetic[] = resJson.data;

        const sortedCosmetics = cosmetics
          .slice()
          .sort(
            (a: Cosmetic, b: Cosmetic) => (b.likedAt || 0) - (a.likedAt || 0),
          );

        setLikedCosmetic(sortedCosmetics);
      } else {
        console.error("리뷰 가져오기 실패:", res.status);
      }
    };

    fetchLiked();
  }, [user?.id]);

  return (
    <div>
      <PageHeader
        title={`관심 제품 ${likedCosmetic?.length ?? 0}개`}
        showBackButton
      />
      <div>
        {likedCosmetic?.length ? (
          <div className="grid grid-cols-2 place-items-center gap-2">
            {likedCosmetic.map((cos) => {
              return <ProductCard cosmetic={cos} key={cos.cosmeticId} />;
            })}
          </div>
        ) : (
          <T2
            children="관심을 표한 제품이 없습니다."
            className="pt-20 text-center text-gray3"
          />
        )}
      </div>
    </div>
  );
}
