"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ProductCard from "@/app/_components/product/ProductCard";
import SearchHeader from "../_components/SearchHeader";
import type { SearchResponse } from "@/types/search";
import { convertSearchToCosmetic } from "@/utils/convertSearchToCosmetic";
import ScrollToTopButton from "@/app/_components/common/ScrollToTopButton";

function SearchResultsPage() {
  // Next.js에서 페이지 이동을 도와줌
  const router = useRouter();
  // 현재 주소(url)에 붙은 쿼리 파라미터를 가져옴
  // ?? : null 또는 undefined일 경우 기본값 사용
  const params = useSearchParams();
  const name = params.get("name") ?? "";
  const brand = params.get("brand") ?? "";
  const topKeyword = params.get("topKeyword") ?? "";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 검색 입력창에 표시도리 검색어 상태
  // 기본값은 url에서 가져온 name 사용
  const [searchText, setSearchText] = useState(name);
  // 검색 결과 문구용
  const [submittedText, setSubmittedText] = useState(name);
  // 백엔드에서 받아온 검색 결과 리스트
  // SearchResponse[] : 검색 결과 객체 배열 타입
  const [results, setResults] = useState<SearchResponse[]>([]);
  // 검색 중 로딩 표시
  // true : 검색중... 완료되면 false
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = () => {
    if (searchText.trim() === "") return;
    // 검색 문구에 표시될 텍스트를 현재 입력값으로 설정
    setSubmittedText(searchText);
    // 검색 결과를 위한 URL 이동
    router.push(
      `/search/result?name=${encodeURIComponent(searchText)}&brand=${encodeURIComponent(brand)}&topKeyword=${encodeURIComponent(topKeyword)}`,
    );
  };

  // Search api와 통신하는 부분
  // useEffect : 컴포넌트가 처음 렌더링되거나, name, brand, topKeyword가 바뀔 때 실행
  useEffect(() => {
    // fetchResults : 검색 결과를 백엔드에서 가져오는 함수
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          // 백엔드 api로 http 요청 보내는 부분
          `${baseUrl}/search?name=${name}&brand=${brand}&topKeyword=${topKeyword}`,
        );
        // 응답을 json 형식으로 변환
        const data = await res.json();
        if (data.success) {
          setResults(data.data); // SearchResponse[] 형태로 저장
        }
      } catch (error) {
        console.error("검색 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [name, brand, topKeyword]);

  return (
    <div>
      {/* ✅ 검색 헤더 추가 */}
      <SearchHeader
        value={searchText}
        onChange={setSearchText}
        onSubmit={handleSearchSubmit}
      />

      {/* ✅ 검색어 결과 문구 추가 */}
      <div className="px-4 pt-2">
        <h2 className="text-lg font-semibold">
          <span className="text-red-500">{submittedText}</span>에 대한 검색 결과
        </h2>
      </div>

      <div className="p-4">
        {loading ? (
          <p>검색 중...</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {results.map((item) => (
              <ProductCard
                key={item.cosmeticId ?? ""}
                cosmetic={convertSearchToCosmetic(item)}
              />
            ))}
          </div>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
        <ScrollToTopButton />
      </div>
    </div>
  );
}
export default function SearchResultsSuspense() {
  return (
    <Suspense>
      <SearchResultsPage />
    </Suspense>
  );
}
