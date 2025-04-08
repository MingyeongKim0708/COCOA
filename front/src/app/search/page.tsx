"use client";

import SearchHeader from "./_components/SearchHeader";
import Button from "./_components/Button";
import Card from "./_components/Card";
import { SearchStore } from "@/stores/SearchStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { recentTags, recentCards, removeTag, removeCard } = SearchStore();

  // 검색창 UI + 검색어를 /search/result로 넘기는 역할
  const handleSubmit = () => {
    if (searchText.trim() === "") return;
    router.push(`/search/result?name=${encodeURIComponent(searchText)}`);
  };

  return (
    <div>
      <SearchHeader
        value={searchText}
        onChange={setSearchText}
        onSubmit={handleSubmit}
      />
      <div className="p-4">
        {/* 최근 검색어 */}
        <div className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">최근 검색어</h2>
          <div className="flex flex-wrap">
            {recentTags.map((tag) => (
              <Button key={tag} label={tag} onRemove={() => removeTag(tag)} />
            ))}
          </div>
        </div>

        {/* 최근 본 제품 */}
        <div className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">최근 본 제품</h2>
          <div className="flex overflow-x-auto pb-2">
            {recentCards.map((url) => (
              <Card key={url} imageUrl={url} onRemove={() => removeCard(url)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
