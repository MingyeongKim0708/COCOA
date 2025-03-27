export interface Cosmetic {
  id: number;
  optionId: number;
  name: string;
  brand: string;
  categoryId: number;
  images: string[];
  keywords: Record<string, number>[];
  isLiked: boolean;
  likeCount: number;
  reviewCount: number;
  ingredient?: string[];
}
