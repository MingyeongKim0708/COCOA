"use client";

import React, { useEffect, useState, useRef } from "react";
import PageHeader from "../_components/common/PageHeader";
import { useRouter } from "next/navigation";

import T3 from "../_components/common/T3";
import T4 from "../_components/common/T4";
import B4 from "../_components/common/B4";

interface CosmeticCategory {
  categoryId: number;
  majorCategory: string;
  middleCategory: string;
  categoryNo: string;
}

type GroupedCategories = {
  [major: string]: CosmeticCategory[];
};

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CosmeticCategory[]>([]);
  const [activeMajor, setActiveMajor] = useState<string>(""); // 현재 활성 major
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const rightRef = useRef<HTMLDivElement | null>(null);
  const leftItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const leftMenuRef = useRef<HTMLDivElement | null>(null); // 왼쪽 전체 영역 ref

  const handleMiddleCategoryClick = (id: number) => {
    router.push(`/category/${id}`);
  };

  const scrollToCategory = (major: string) => {
    const section = sectionRefs.current[major];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScroll = () => {
    if (!rightRef.current) return;

    const scrollTop = rightRef.current.scrollTop;
    const scrollHeight = rightRef.current.scrollHeight;
    const clientHeight = rightRef.current.clientHeight;

    const offsets = Object.entries(sectionRefs.current).map(([major, el]) => ({
      major,
      offset: el?.offsetTop ?? 0,
    }));

    // 1. 맨 아래 도달하면 마지막 major 활성화
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setActiveMajor(offsets[offsets.length - 1].major);
      return;
    }

    // 2. 일반적인 경우 - offset 기준으로 스크롤 위치에 맞는 섹션 활성화
    const current = offsets
      .sort((a, b) => a.offset - b.offset)
      .reverse()
      .find((section) => scrollTop + 100 >= section.offset);

    if (current) {
      setActiveMajor(current.major);
    }
  };

  // 백엔드 요청
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category`,
      );
      const json = await res.json();
      setCategories(json.data); // ApiResponse 형태 기준
    } catch (err) {
      console.error("카테고리 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const firstMajor = categories[0].majorCategory;
      setActiveMajor(firstMajor);
    }
  }, [categories]);

  useEffect(() => {
    if (!leftMenuRef.current || !activeMajor) return;

    const targetEl = leftItemRefs.current[activeMajor];
    const parentEl = leftMenuRef.current;

    if (targetEl) {
      const targetTop = targetEl.offsetTop;
      const targetBottom = targetTop + targetEl.offsetHeight;
      const parentScrollTop = parentEl.scrollTop;
      const parentHeight = parentEl.clientHeight;

      // 요소가 현재 보이지 않는 위치에 있을 경우만 스크롤 이동
      if (
        targetTop < parentScrollTop ||
        targetBottom > parentScrollTop + parentHeight
      ) {
        parentEl.scrollTo({
          top: targetTop - parentHeight / 2, // 가운데 쯤으로
          behavior: "smooth",
        });
      }
    }
  }, [activeMajor]);

  const grouped = categories.reduce((acc, cur) => {
    if (!acc[cur.majorCategory]) {
      acc[cur.majorCategory] = [];
    }
    acc[cur.majorCategory].push(cur);
    return acc;
  }, {} as GroupedCategories);

  const majorList = Object.keys(grouped);

  return (
    <>
      <PageHeader title="카테고리" />
      <div className="ml-[-1.25rem]">
        <div className="flex h-[calc(100vh-7rem)]">
          {/* 왼쪽 고정 메뉴 */}
          <div
            ref={leftMenuRef}
            className="scrollbar-hide max-h-[calc(100vh-4rem)] w-1/3 overflow-y-auto border-r bg-gray5"
          >
            {majorList.map((major) => (
              <div
                key={major}
                ref={(el) => {
                  leftItemRefs.current[major] = el;
                }}
                onClick={() => scrollToCategory(major)}
                className={`cursor-pointer px-3 py-3 ${
                  activeMajor === major ? "bg-white" : "bg-gray5"
                }`}
              >
                {activeMajor === major ? <T4>{major}</T4> : <B4>{major}</B4>}
              </div>
            ))}
          </div>

          {/* 오른쪽 스크롤 영역 */}
          <div
            ref={rightRef}
            onScroll={handleScroll}
            className="scrollbar-hide w-2/3 overflow-y-auto scroll-smooth px-4"
          >
            {majorList.map((major) => (
              <div
                key={major}
                ref={(el) => {
                  sectionRefs.current[major] = el;
                }}
                className="border-b border-gray4 pb-4"
              >
                <div className="flex items-center gap-2">
                  <img
                    src="/melong.png"
                    alt="캐릭터"
                    className="h-6 w-6 object-contain"
                  />
                  <T3 children={major} className="py-4" />
                </div>
                <div className="space-y-4">
                  {grouped[major].map((cat) => (
                    <div
                      key={cat.categoryId}
                      onClick={() => handleMiddleCategoryClick(cat.categoryId)}
                      className="cursor-pointer hover:underline"
                    >
                      <B4>{cat.middleCategory}</B4>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
