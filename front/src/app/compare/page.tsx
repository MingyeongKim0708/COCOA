"use client";

import { fetchWrapper } from "@/lib/fetchWrapper";
import { useEffect, useState } from "react";
import PageHeader from "../_components/common/PageHeader";
import CompareItemSection from "./_components/CompareItemSection";
import B4 from "../_components/common/B4";
import { useUserStore } from "@/stores/UserStore";
import T5 from "../_components/common/T5";
import T4 from "../_components/common/T4";

// 더미 데이터
const dummyCompareData = [
  {
    cosmeticId: 1,
    brand: "넘버즈인",
    name: "[모공케어/탄력광채] 넘버즈인 3번 결광가득 에센스 토너 300ml 대용량 기획",
    imageUrl: "/images/A00000013216229ko.jpg",
    top5Keywords: [
      { keyword: "촉촉", count: 100, matched: true },
      { keyword: "수분", count: 57, matched: true },
      { keyword: "트러블", count: 38, matched: false },
      { keyword: "안티에이징", count: 13, matched: false },
      { keyword: "닦토", count: 12, matched: false },
    ],
    matchedKeywords: ["촉촉", "수분"],
    ingredients: "정제수, 다이프로필렌글라이콜, 나이아신아마이드",
  },
  {
    cosmeticId: 2,
    brand: "라운드랩",
    name: "[1등토너] 라운드랩 1025 독도 토너 200ml 기획(+50ml)",
    imageUrl: "/images/A00000015861604ko.jpg",
    top5Keywords: [
      { keyword: "수분", count: 50, matched: true },
      { keyword: "보습", count: 33, matched: true },
      { keyword: "진정", count: 16, matched: true },
      { keyword: "트러블", count: 10, matched: false },
      { keyword: "안티에이징", count: 4, matched: false },
    ],
    matchedKeywords: ["수분", "보습", "진정"],
    ingredients: "정제수, 글리세린, 다이프로필렌글라이콜",
  },
];

export default function ComparePage() {
  // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // const [items, setItems] = useState<ComparedCosmetic[]>([]);
  // useEffect(() => {
  //   fetchWrapper(`${baseUrl}/compare`)
  //     .then((res) => res.json())
  //     .then(setItems);
  // }, []);
  const [items] = useState(dummyCompareData);
  const [progress, setProgress] = useState(false);
  const { user } = useUserStore();

  const left = items[0];
  const right = items[1];

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
          <p>
            <span className="font-[680] text-red2">
              {[
                ...new Set([...left.matchedKeywords, ...right.matchedKeywords]),
              ].join(", ")}
            </span>
            입니다
          </p>
        </B4>
      )}
      <div className="grid grid-cols-2 gap-4 pt-6">
        <CompareItemSection data={left} side="left" progress={progress} />
        <CompareItemSection data={right} side="right" progress={progress} />
      </div>
    </div>
  );
}
