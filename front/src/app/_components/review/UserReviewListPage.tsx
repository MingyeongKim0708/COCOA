"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Review } from "@/types/review";
import { User } from "@/types/user";
import ReviewCard from "@/app/_components/review/ReviewCard";
import PageHeader from "@/app/_components/common/PageHeader";
import { fetchWrapper } from "@/lib/fetchWrapper";
import OtherUserInfo from "../user/OtherUserInfo";
import { UserWithKeywords } from "@/types/userInfo";

interface UserReviewListProps {
  userId: string;
}

export default function UserReviewListPage({ userId }: UserReviewListProps) {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserWithKeywords | null>(null);
  const [reviews, setReviews] = useState<Array<Review> | null>(null);
  const [page, setPage] = useState<number | 0>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId || Array.isArray(userId)) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetchWrapper(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/user/${userId}?page=${page}`,
        );
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        setUserInfo(data.user);
        setReviews(data.reviews);
        setPage(1);
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/users/${userId}?page=${page}`,
    );
    if (!res.ok) throw new Error("failed");
    const data = await res.json();
    setReviews(reviews?.concat(data.reviews) || null);
    setPage(page + 1);
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
        {userInfo ? <OtherUserInfo userInfos={userInfo} /> : null}
        {reviews?.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>
    </>
  );
}
