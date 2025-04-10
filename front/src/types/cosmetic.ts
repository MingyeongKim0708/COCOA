import { Category } from "./category";

export interface Cosmetic {
  cosmeticId: number;
  optionName: string;
  name: string;
  brand: string;
  category: Category;
  images: string[];
  keywords: Record<string, number> | null;
  topKeywords: string[];
  liked: boolean;
  likedAt?: string;
  likeCount: number;
  reviewCount: number;
  ingredient: string;
}
