import { create } from "zustand";

interface SearchStore {
  recentTags: string[]; // 최근 검색어 태그
  recentCards: string[]; // 최근 본 카드 이미지 경로
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  removeCard: (url: string) => void;
}

export const SearchStore = create<SearchStore>((set) => ({
  recentTags: ["촉촉", "라운드랩 소나무", "티트리시카", "소나무 진정"],
  recentCards: ["/img/product1.png", "/img/product2.png", "/img/product3.png"],
  addTag: (tag) =>
    set((state) => {
      const filtered = state.recentTags.filter((t) => t !== tag);
      const updated = [tag, ...filtered];
      return {
        recentTags: updated.slice(0, 20), // ✅ 최대 20개까지 유지
      };
    }),
  removeTag: (tag) =>
    set((state) => ({
      recentTags: state.recentTags.filter((t) => t !== tag),
    })),
  removeCard: (url) =>
    set((state) => ({
      recentCards: state.recentCards.filter((c) => c !== url),
    })),
}));
