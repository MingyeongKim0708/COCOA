"use client";

import React, { Suspense } from "react";
import ReviewForm from "@/app/_components/review/ReviewForm";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Review } from "@/types/review";
import { fetchWrapper } from "@/lib/fetchWrapper";

function ReviewEditPage() {
  const searchParams = useSearchParams();
  const reviewId = searchParams.get("reviewId");

  const [review, setReview] = useState<Review | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!reviewId) router.back();
    fetchWrapper(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/${reviewId}`,
      {
        method: "GET",
      },
    )
      .then((res) => res.json())
      .then((data) => setReview(data));
  }, [reviewId]);

  const handleSubmit = async ({
    reviewId,
    cosmeticId,
    satisfied,
    content,
    images,
  }: {
    reviewId?: number;
    cosmeticId: number;
    satisfied: boolean;
    content: string;
    images: File[];
  }) => {
    const formData = new FormData();
    formData.append("cosmeticId", String(reviewId));
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

  return review && review.cosmetic ? (
    <ReviewForm
      initialReview={review}
      cosmetic={review.cosmetic}
      onSubmit={handleSubmit}
    />
  ) : (
    <div>로딩 중...</div>
  );
}

export default function ReviewEditSuspense() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <ReviewEditPage />
    </Suspense>
  );
}
