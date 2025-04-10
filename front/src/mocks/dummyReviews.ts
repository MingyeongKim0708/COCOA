import { Review } from "@/types/review";
import { AgeGroup, Gender, SkinTone, SkinType } from "@/types/user";

export const reviewUser: Review = {
  reviewId: 0,
  content:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum quae sed cum assumenda error quidem rem, quibusdam ut, corporis distinctio repudiandae quod. Enim omnis maxime, aliquam in cumque labore dolores.",
  satisfied: false,
  helpfulCount: 0,
  user: {
    id: 0,
    nickname: "snsksks",
    ageGroup: AgeGroup.teen,
    gender: Gender.female,
    skinType: SkinType.dry,
    skinTone: SkinTone.spring_warm,
    imageUrl: "https://placehold.co/600x400",
  },
  cosmetic: null,
  helpfulForMe: false,
  createdAt: "2023.10.21",
  imageUrls: [],
};
export const reviewCosmetic: Review = {
  reviewId: 0,
  content:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum quae sed cum assumenda error quidem rem, quibusdam ut, corporis distinctio repudiandae quod. Enim omnis maxime, aliquam in cumque labore dolores.",
  satisfied: false,
  helpfulCount: 0,
  user: null,
  cosmetic: {
    cosmeticId: 0,
    name: "디오디너리 글리코릭 애시드 7% 엑스폴리에이팅 토너 240ml",
    brand: "ㄴㅁㄹㄴㅁㅇㄴㅁㅇㄴㅁㅇㄴㅁㄴㄴ",
    images: ["https://placehold.co/600x400"],
    keywords: {
      촉촉함: 2,
      촉촉: 2,
      촉함: 2,
      촉촉2함: 2,
      촉촉1함: 2,
    },
    topKeywords: ["촉촉함", "촉촉", "촉촉2함"],
    optionName: "",
    category: {
      categoryId: 0,
      majorCategory: "케어",
      middleCategory: "스킨",
    },
    liked: false,
    likeCount: 0,
    reviewCount: 0,
    ingredient: "",
  },
  helpfulForMe: false,
  createdAt: "2023.10.21",
  imageUrls: [],
};
