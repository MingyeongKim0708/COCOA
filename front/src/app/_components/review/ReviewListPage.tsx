"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Review } from "@/types/review";
import { User } from "@/types/user";
import ReviewCard from "@/app/_components/review/ReviewCard";
import PageHeader from "@/app/_components/common/PageHeader";
import { reviewCosmetic, reviewUser } from "@/mocks/dummyReviews";
import UserInfo from "@/app/_components/user/UserInfo";
import { fetchWrapper } from "@/lib/fetchWrapper";

interface ReviewListProps {
  userId?: string;
  cosmeticId?: string;
}

export default function ReviewListPage({ userId }: ReviewListProps) {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Array<Review> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setReviews([reviewCosmetic, reviewUser]);
  }, []);

  useEffect(() => {
    if (!userId || Array.isArray(userId)) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetchWrapper(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/users/${userId}`,
        );
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        setUserInfo(data.user);
        setReviews(data.reviews);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const reviewRequest = async () => {
    const res = await fetchWrapper(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/users/${userId}`,
    );
    if (!res.ok) throw new Error("failed");
    const data = await res.json();
    setReviews(reviews?.concat(data.reviews) || null);
  };

  return (
    <>
      {
        <PageHeader
          title={`리뷰 ${reviews ? reviews.length : 0}`}
          showBackButton
        />
      }
      <div>
        <UserInfo user={userInfo} />
        {reviews?.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>
    </>
  );
}
