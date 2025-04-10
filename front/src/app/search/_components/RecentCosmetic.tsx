"use client";

import { SearchStore, saveRecentCosmetic } from "@/stores/SearchStore";
import Card from "./Card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecentCosmetic() {
  const { recentCards, removeCard } = SearchStore();

  useEffect(() => {
    SearchStore.getState().fetchRecentData();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">최근 본 제품</h2>
      <div className="flex overflow-x-auto pb-2">
        {recentCards
          .filter(
            (entry) =>
              entry && entry.includes("|") && entry.split("|")[1] !== "null",
          )
          .map((entry) => {
            const [id, imageUrl] = entry.split("|"); // 여기서 파싱!
            return (
              <Card
                key={entry}
                imageUrl={imageUrl}
                onRemove={() => removeCard(entry)}
                id={id}
              />
            );
          })}
      </div>
    </div>
  );
}
