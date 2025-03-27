export interface Cosmetic {
  id: number;
  optionId: number;
  name: string;
  brand: string;
  categoryId: number;
  images: string[];
  keywords: string[];
  isLiked: boolean;
  likeCount: number;
  reviewCount: number;
  ingredient?: string[];
}
