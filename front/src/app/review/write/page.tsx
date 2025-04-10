"use client";

import ReviewForm from "@/app/_components/review/ReviewForm";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Cosmetic } from "@/types/cosmetic";
import { dummyProducts } from "@/mocks/dummyProducts";
import { fetchWrapper } from "@/lib/fetchWrapper";

function ReviewWritePage() {
  const searchParams = useSearchParams();
  const cosmeticId = searchParams.get("cosmeticId");

  const [cosmetic, setCosmetic] = useState<Cosmetic | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!cosmeticId) {
      setCosmetic(dummyProducts[0]);
    } else {
      // ${process.env.NEXT_PUBLIC_API_BASE_URL}
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cosmetics/${cosmeticId}`)
        .then((res) => res.json())
        .then((data) => setCosmetic(data));
    }
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
    formData.append("cosmeticId", cosmeticId.toString());
    formData.append("satisfied", satisfied.toString());
    formData.append("content", content);

    images.forEach((image, index) => {
      formData.append("imageFiles", image);
    });
    //
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/write`,
      {
        method: "POST",
        credentials: "include",
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
export default function ReviewWriteSuspense() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <ReviewWritePage />
    </Suspense>
  );
}
