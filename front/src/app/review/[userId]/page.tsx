"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { AgeGroup, Gender, SkinTone, SkinType } from "@/types/user";
import { Review } from "@/types/review";
import ReviewCard from "@/app/_components/review/ReviewCard";
import PageHeader from "@/app/_components/common/PageHeader";

export default function ReviewListPage() {
  const router = useRouter();
  const reviews: Array<Review> = [];
  const reviewUser: Review = {
    reviewId: 0,
    userId: 0,
    cosmeticId: 0,
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum quae sed cum assumenda error quidem rem, quibusdam ut, corporis distinctio repudiandae quod. Enim omnis maxime, aliquam in cumque labore dolores.",
    sentiment: false,
    helpfulCount: 0,
    user: {
      id: 0,
      nickname: "snsksks",
      ageGroup: AgeGroup.teen,
      gender: Gender.female,
      skinType: SkinType.dry,
      skinTone: SkinTone.spring_warm,
      imageUrl: "https://placehold.co/600x400",
    },
    cosmetic: null,
    helpfulForMe: false,
    createdAt: "2023.10.21",
  };
  const reviewCosmetic: Review = {
    reviewId: 0,
    userId: 0,
    cosmeticId: 0,
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum quae sed cum assumenda error quidem rem, quibusdam ut, corporis distinctio repudiandae quod. Enim omnis maxime, aliquam in cumque labore dolores.",
    sentiment: false,
    helpfulCount: 0,
    user: null,
    cosmetic: {
      id: 0,
      name: "디오디너리 글리코릭 애시드 7% 엑스폴리에이팅 토너 240ml",
      brand: "ㄴㅁㄹㄴㅁㅇㄴㅁㅇㄴㅁㅇㄴㅁㄴㄴ",
      imageUrl: "https://placehold.co/600x400",
      keywords: {
        촉촉함: 2,
        촉촉: 2,
        촉함: 2,
        촉촉2함: 2,
        촉촉1함: 2,
      },
    },
    helpfulForMe: false,
    createdAt: "2023.10.21",
  };

  console.log(router);
  return (
    <div>
      <PageHeader title={`리뷰 ${reviews.length}`} showBackButton />
      <ReviewCard review={reviewUser} />
      <ReviewCard review={reviewCosmetic} />
      <ReviewCard review={reviewUser} />
      <ReviewCard review={reviewCosmetic} />
    </div>
  );
}
