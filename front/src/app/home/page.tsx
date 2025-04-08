"use client";
import React, { useState } from "react";
import { useUserStore } from "@/stores/UserStore";
import PageHeader from "../_components/common/PageHeader";
import { RecommendationCard } from "./_components/RecommendationCard";
import { KeywordMarquee } from "./_components/KeywordMarquee";
import PopularNews from "./_components/PopularNews";
import SearchBar from "../_components/common/SearchBar";

export default function HomePage() {
  const { user, keywords } = useUserStore();
  return (
    <div>
      <PageHeader
        title={
          <>
            안녕하세요 <span className="text-pink1">{user.nickname}</span>님
          </>
        }
      />
      <div className="py-5">
        <SearchBar />
      </div>

      {/* 최근 본 제품 추천 */}
      <RecommendationCard />

      {/* 사용자 키워드 현황 */}
      <KeywordMarquee />

      {/* 인기 소식 */}
      <PopularNews />
    </div>
  );
}
