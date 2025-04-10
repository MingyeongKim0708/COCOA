"use client";

import { SearchStore } from "@/stores/SearchStore";
import Button from "./Button";
import { useEffect } from "react";

export default function RecentLog() {
  const { recentTags, removeTag, fetchRecentData } = SearchStore();

  useEffect(() => {
    SearchStore.getState().fetchRecentData();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">최근 검색어</h2>
      <div className="flex space-x-2 overflow-x-auto whitespace-nowrap">
        {recentTags.map((tag) => (
          <Button key={tag} label={tag} onRemove={() => removeTag(tag)} />
        ))}
      </div>
    </div>
  );
}
