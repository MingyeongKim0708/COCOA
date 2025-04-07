"use client";

import ReviewForm from "@/app/_components/review/ReviewForm";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Cosmetic } from "@/types/cosmetic";
import { dummyProducts } from "@/mocks/dummyProducts";
import { fetchWrapper } from "@/lib/fetchWrapper";

export default function ReviewWritePage() {
  const searchParams = useSearchParams();
  let cosmeticId = searchParams.get("cosmeticId");

  const [cosmetic, setCosmetic] = useState<Cosmetic | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!cosmeticId) setCosmetic(dummyProducts[0]);
    // ${process.env.NEXT_PUBLIC_API_BASE_URL}
    fetch(`localhost:8080/cosmetics/${cosmeticId}`)
      .then((res) => res.json())
      .then((data) => setCosmetic(data));
  }, [cosmeticId]);

  const handleSubmit = async ({
    cosmeticId,
    satisfied,
    content,
    images,
  }: {
    cosmeticId: number;
    satisfied: boolean;
    content: string;
    images: File[];
  }) => {
    const formData = new FormData();
    formData.append("cosmeticId", String(cosmeticId));
    formData.append("satisfied", String(satisfied));
    formData.append("content", content);
    images.forEach((file) => formData.append("imageFiles", file));

    const res = await fetchWrapper(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/write`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (res.ok) {
      alert("리뷰가 등록되었습니다!");
      router.back(); // 또는 리뷰 목록 페이지
    } else {
      alert("리뷰 등록 실패");
    }
  };

  return cosmetic ? (
    <ReviewForm cosmetic={cosmetic} onSubmit={handleSubmit} />
  ) : (
    <div>로딩 중...</div>
  );
}
