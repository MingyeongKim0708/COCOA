"use client";

import { fetchWrapper } from "@/lib/fetchWrapper";
import { useEffect, useState } from "react";
import PageHeader from "../_components/common/PageHeader";
import CompareItemSection from "./_components/CompareItemSection";
import B4 from "../_components/common/B4";
import { useUserStore } from "@/stores/UserStore";
import { ComparedCosmetic } from "@/types/compare";

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
        <B4 className="pt-5 text-center">
          <p>
            <span className="font-[680] text-red2">{user.nickname}</span>
            님과 겹치는 키워드는
          </p>
          {matched.length > 0 ? (
            <p>
              <span className="font-[680] text-red2">{matched.join(", ")}</span>
              입니다
            </p>
          ) : (
            <p className="font-[680] text-gray4">없습니다</p>
          )}
        </B4>
      )}
      <div className="grid grid-cols-2 gap-4 pt-6">
        <CompareItemSection data={left} side="left" progress={progress} />
        <CompareItemSection data={right} side="right" progress={progress} />
      </div>
    </div>
  );
}
