"use client";
import React, { useEffect, useMemo, useState } from "react";
import ReviewUserInfo from "../_components/user/UserInfo";
import { useUserStore } from "@/stores/UserStore";
import UserWordCloud from "../_components/wordcloud/UserWordCloud";
import PreviewLikeItems from "./_components/PreviewLikeItems";
import PreviewMyReview from "./_components/PreviewMyReview";
import B5 from "../_components/common/B5";
import { useRouter } from "next/navigation";
import { fetchWrapper } from "@/lib/fetchWrapper";

export default function MyPage() {
  const { user, keywords } = useUserStore();
  const router = useRouter();

  const words = useMemo(() => {
    if (!user || !keywords) return {};

    const excludeKeys = [user.gender, user.skinType, user.skinTone]
      .filter(Boolean)
      .map(String);

    const filteredKeywords = Object.fromEntries(
      Object.entries(keywords).filter(([key, value]) => {
        if (excludeKeys.includes(key) && value <= 1) return false;
        return true;
      }),
    );

    return filteredKeywords;
  }, [keywords, user]);

  const handleClickWithdraw = () => {
    router.push("/my/withdraw");
  };

  const handleLogOut = async () => {
    try {
      const response = await fetchWrapper(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/logout`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        // 로그아웃 성공 처리 (예: 홈으로 이동)
        console.log("로그아웃 성공");
        router.push("/");
      } else {
        console.error("로그아웃 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 pt-[2rem]">
      <ReviewUserInfo user={user} />
      <UserWordCloud words={words} />
      <PreviewLikeItems />
      <PreviewMyReview user={user} />
      <div className="flex flex-row items-center justify-center gap-3 text-gray3">
        <B5 children={"로그아웃"} onClick={() => handleLogOut()} />
        <B5 children={"회원탈퇴"} onClick={() => handleClickWithdraw()} />
      </div>
    </div>
  );
}
