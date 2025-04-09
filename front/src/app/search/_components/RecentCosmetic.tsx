"use client";

import { SearchStore } from "@/stores/SearchStore";
import Card from "./Card";
import { useEffect } from "react";

export default function RecentCosmetic() {
  const { recentCards, removeCard } = SearchStore();

  useEffect(() => {
    SearchStore.getState().fetchRecentData();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">최근 본 제품</h2>
      <div className="flex overflow-x-auto pb-2">
        {recentCards.map((url) => (
          <Card key={url} imageUrl={url} onRemove={() => removeCard(url)} />
        ))}
      </div>
    </div>
  );
}
