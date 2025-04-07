export interface ComparedCosmetic {
  cosmeticId: number;
  brand: string;
  name: string;
  imageUrl: string;
  top5Keywords: CompareKeyword[];
  matchedKeywords: string[];
  ingredients: string;
}

export interface CompareKeyword {
  keyword: string;
  count: number;
  matched: boolean;
}
