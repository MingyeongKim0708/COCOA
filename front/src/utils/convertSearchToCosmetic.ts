import type { SearchResponse } from "@/types/search";
import type { Cosmetic } from "@/types/cosmetic";
// 검색 결과(SearchResponse)를 실제 화면에서 사용할 화장품 데이터(Cosmetic)로 변환하는 함수
export function convertSearchToCosmetic(item: SearchResponse): Cosmetic {
  return {
    id: item.cosmeticId ? Number(item.cosmeticId) : 0,
    name: item.name ?? "",
    brand: item.brand ?? "",
    optionName: "",
    category: {
      categoryId: 0,
      majorCategory: "기본 카테고리",
      middleCategory: "중간 카테고리",
    }, // Category 객체로 채워주기
    images: [
      item.imageUrl1
        ? `${item.imageUrl1}`
        : `${process.env.NEXT_PUBLIC_S3_URL}/profile-image/default_profile.png`,
    ],
    keywords: {}, // 기본값으로 비워진 객체
    topKeywords: item.topKeyword?.split(",") ?? [],
    isLiked: false,
    likeCount: 0,
    reviewCount: 0,
    ingredient: "",
  };
}
