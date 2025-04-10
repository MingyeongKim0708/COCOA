"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/UserStore";
import PageHeader from "../_components/common/PageHeader";
import { RecommendationCard } from "./_components/RecommendationCard";
import { Keyword } from "./_components/Keyword";
import PopularNews from "./_components/PopularNews";
import SearchHeader from "../search/_components/SearchHeader";

export default function HomePage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSubmit = () => {
    if (searchText.trim() === "") return;
    router.push(`/search/result?name=${encodeURIComponent(searchText)}`);
  };

  return (
    <div>
      <PageHeader
        title={
          <>
            안녕하세요 <span className="text-pink1">{user.nickname}</span>님
          </>
        }
      />
      <div className="py-2">
        <SearchHeader
          value={searchText}
          onChange={setSearchText}
          onSubmit={handleSubmit}
        />
      </div>

      {/* 최근 본 제품 추천 */}
      <RecommendationCard />

      {/* 사용자 키워드 현황 */}
      <Keyword />

      {/* 인기 소식 */}
      <PopularNews />
    </div>
  );
}
