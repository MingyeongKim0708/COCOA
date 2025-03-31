// src/mocks/dummyProducts.ts
import type { Cosmetic } from "@/types/cosmetic";

export const dummyProducts: Pick<
  Cosmetic,
  "id" | "name" | "brand" | "images" | "keywords" | "isLiked" | "likeCount"
>[] = [
  {
    id: 1,
    name: "[1등토너] 라운드랩 1025 독도 토너 200ml 기획 (+50ml)",
    brand: "라운드랩",
    images: ["/images/A00000013216229ko.jpg"],
    keywords: [
      { 촉촉: 5 },
      { 윤기: 4 },
      { 지복합성: 3 },
      { 트러블: 2 },
      { 가성비: 1 },
    ],
    isLiked: true,
    likeCount: 131,
  },
  {
    id: 2,
    name: "[모공개선/탄력광채] 넘버즈인 3번 결광가득 에센스 토너 300ml 대용량 기획",
    brand: "넘버즈인글자길이를테스트하기위해길게작성합니다",
    images: ["/images/A00000017358912ko.jpg"],
    keywords: [{ 태그길이용: 10 }, { 테스트: 9 }, { 옆으로스크롤: 1 }],
    isLiked: true,
    likeCount: 210,
  },
  {
    id: 3,
    name: "[속보습]닥터지 더모이스처 배리어 D 리퀴드 토너 200ml 기획 (+100ml)",
    brand: "닥터지",
    images: ["/images/A00000013216229ko.jpg"],
    keywords: [{ 겨울: 10 }, { 보습: 9 }, { 건성: 1 }],
    isLiked: false,
    likeCount: 183,
  },
  {
    id: 4,
    name: "헤라 옴므 파워부스팅 토너 150ML",
    brand: "헤라",
    images: ["/images/A00000017807504ko.jpg"],
    keywords: [{ 헤라: 10 }, { 옴므: 9 }, { 지복합성성: 1 }],
    isLiked: false,
    likeCount: 13,
  },
  {
    id: 5,
    name: "[피지쓱싹] 브링그린 티트리시카수딩토너 500mL 기획/단품",
    brand: "브링그린",
    images: ["/images/A00000018918108ko.jpg"],
    keywords: [{ 진정: 10 }, { 수부지: 9 }, { 브링그린: 1 }],
    isLiked: false,
    likeCount: 13,
  },
  {
    id: 6,
    name: "디오디너리 글리코릭 애시드 7% 엑스폴리에이팅 토너 240ml",
    brand: "디오디너리",
    images: ["/images/A00000015861604ko.jpg"],
    keywords: [{ 각질: 10 }, { 자극: 9 }, { 따가움: 1 }],
    isLiked: false,
    likeCount: 193,
  },
];
