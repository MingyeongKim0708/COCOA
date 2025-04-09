"use client";

import { fetchWrapper } from "@/lib/fetchWrapper";
import { useEffect, useState } from "react";
import PageHeader from "../_components/common/PageHeader";
import CompareItemSection from "./_components/CompareItemSection";
import B4 from "../_components/common/B4";
import { useUserStore } from "@/stores/UserStore";
import { ComparedCosmetic } from "@/types/compare";
import T4 from "../_components/common/T4";

export default function ComparePage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [items, setItems] = useState<ComparedCosmetic[]>([]);
  useEffect(() => {
    fetchWrapper(`${baseUrl}/compare`)
      .then((res) => res.json())
      .then((data) => {
        console.log("compare items:", data);
        setItems(data.data);
      });
  }, []);
  const [progress, setProgress] = useState(false);
  const { user } = useUserStore();

  const left = items[0];
  const right = items[1];

  const matched =
    left && right
      ? [...new Set([...left.matchedKeywords, ...right.matchedKeywords])]
      : [];

  useEffect(() => {
    setTimeout(() => setProgress(true), 100);
  }, []);

  return (
    <div>
      <PageHeader title="비교하기" />
      {left && right && (
        <div className="flex flex-col items-center pt-5">
          <div className="flex flex-row">
            <T4 className="text-red2">{user.nickname}</T4>
            <B4>님과 겹치는 키워드는</B4>
          </div>
          {matched.length > 0 ? (
            <p>
              <span className="font-title text-red2">{matched.join(", ")}</span>
              입니다
            </p>
          ) : (
            <p className="font-title text-gray4">없습니다</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 pt-6">
        <CompareItemSection data={left} side="left" progress={progress} />
        <CompareItemSection data={right} side="right" progress={progress} />
      </div>
    </div>
  );
}
