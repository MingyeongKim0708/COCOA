"use client";

import SearchHeader from "./_components/SearchHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchByName } from "@/stores/SearchStore";
import RecentLog from "./_components/RecentLog";
import RecentCosmetic from "./_components/RecentCosmetic";

export default function SearchPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSubmit = async () => {
    if (searchText.trim() === "") return;

    // ✅ 1. 백엔드로 검색 요청을 직접 보냄 (→ Redis 저장 트리거)
    await searchByName(searchText.trim());

    // ✅ 2. 검색 결과 페이지로 이동
    router.push(`/search/result?name=${encodeURIComponent(searchText.trim())}`);
  };

  return (
    <div>
      <SearchHeader
        value={searchText}
        onChange={setSearchText}
        onSubmit={handleSubmit}
      />
      <div className="p-4">
        <RecentLog />
        <RecentCosmetic />
      </div>
    </div>
  );
}
