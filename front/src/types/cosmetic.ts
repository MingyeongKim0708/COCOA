import { Category } from "./category";

export interface Cosmetic {
  cosmeticId: number;
  optionName: string;
  name: string;
  brand: string;
  category: Category;
  images: string[];
  keywords: Record<string, number>;
  topKeywords: string[];
  isLiked: boolean;
  likeCount: number;
  reviewCount: number;
  ingredient: string;
}
