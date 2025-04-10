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
import T3 from "../common/T3";

interface CosmeticReviewListProps {
  cosmeticId: string;
}

export default function CosmeticReviewListPage({
  cosmeticId,
}: CosmeticReviewListProps) {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Array<Review> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setReviews([reviewCosmetic, reviewUser]);
  }, []);

  useEffect(() => {
    if (!cosmeticId || Array.isArray(cosmeticId)) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetchWrapper(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/cosmetic/${cosmeticId}`,
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/users/${cosmeticId}`,
    );
    if (!res.ok) throw new Error("failed");
    const data = await res.json();
    setReviews(reviews?.concat(data.reviews) || null);
  };

  return (
    <>
      <div className="flex justify-between">
        <T3 children={`리뷰 ${reviews ? reviews.length : 0}`} />
      </div>
      <div>
        {reviews?.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>
    </>
  );
}
