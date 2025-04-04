"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Review } from "@/types/review";
import { User } from "@/types/user";
import ReviewCard from "@/app/_components/review/ReviewCard";
import PageHeader from "@/app/_components/common/PageHeader";
import ReviewUserInfo from "@/app/_components/review/ReviewUserInfo";

interface ReviewPageProps {
  params: { userId: string };
}

export default function ReviewListPage({ params }: ReviewPageProps) {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Array<Review> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 👉 진입 시 cosmetic 정보 가져오기
  useEffect(() => {
    if (!params.userId || Array.isArray(params.userId)) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/users/${params.userId}`,
        );
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        setUserInfo(data.user);
        setReviews(data.review);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [params.userId]);

  return (
    <>
      <PageHeader
        title={`리뷰 ${reviews ? reviews.length : 0}`}
        showBackButton
      />
      <div>
        <ReviewUserInfo user={userInfo} />
        {reviews?.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>
    </>
  );
}
