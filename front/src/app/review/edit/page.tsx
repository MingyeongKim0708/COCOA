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
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/edit?reviewId=${reviewId}`,
      {
        method: "GET",
        credentials: "include",
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
    imageUrls,
    images,
  }: {
    reviewId?: number;
    cosmeticId: number;
    satisfied: boolean;
    content: string;
    imageUrls?: string[];
    images: File[];
  }) => {
    const formData = new FormData();
    formData.append("reviewId", String(reviewId));
    formData.append("satisfied", String(satisfied));
    formData.append("content", content);
    imageUrls?.forEach((imageUrl, index) =>
      formData.append("imageUrls", imageUrl),
    );
    images.forEach((image, index) => {
      formData.append("imageFiles", image);
    });

    const res = await fetchWrapper(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/edit`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (res.ok) {
      alert("리뷰가 갱신되었습니다!");
      router.back(); // 또는 리뷰 목록 페이지
    } else {
      alert("리뷰 갱신 실패");
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
