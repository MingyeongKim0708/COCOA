"use client";
import React, { useEffect, useState } from "react";
import ReviewUserInfo from "../_components/user/UserInfo";
import { useUserStore } from "@/stores/UserStore";
import UserWordCloud from "../_components/wordcloud/UserWordCloud";
import PreviewLikeItems from "./_components/PreviewLikeItems";
import PreviewMyReview from "./_components/PreviewMyReview";
import B5 from "../_components/common/B5";
import { useRouter } from "next/navigation";
import CosmeticWordCloud from "../_components/wordcloud/CosmeticWordCloud";
import { dummyWords } from "@/mocks/dummyWords";

export default function MyPage() {
  const { user, keywords } = useUserStore();
  const router = useRouter();

  const handleClickWithdraw = () => {
    router.push("/my/withdraw");
  };

  return (
    <div className="flex flex-col gap-2 pt-[2rem]">
      <ReviewUserInfo user={user} />
      <UserWordCloud words={keywords} />
      <PreviewLikeItems />
      <PreviewMyReview user={user} />
      <div className="flex flex-row items-center justify-center gap-3 text-gray3">
        <B5
          children={"로그아웃"}
          onClick={() => console.log("로그아웃 api 붙이기")}
        />
        <B5 children={"회원탈퇴"} onClick={() => handleClickWithdraw()} />
      </div>
    </div>
  );
}
