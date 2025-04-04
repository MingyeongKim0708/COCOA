import { Category } from "./category";

export interface Cosmetic {
  id: number;
  optionId: number;
  name: string;
  brand: string;
  category: Category;
  images: string[];
  keywords: Record<string, number>;
  isLiked: boolean;
  likeCount: number;
  reviewCount: number;
  ingredient?: string[];
}
