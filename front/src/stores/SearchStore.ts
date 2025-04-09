import { create } from "zustand";

interface SearchState {
  recentTags: string[];
  recentCards: string[];
  fetchRecentData: () => Promise<void>;
  removeTag: (tag: string) => void;
  removeCard: (url: string) => void;
}

export const SearchStore = create<SearchState>((set, get) => ({
  recentTags: [],
  recentCards: [],

  fetchRecentData: async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const [logRes, cardRes] = await Promise.all([
        fetch(`${baseUrl}/search/recentLog`, { credentials: "include" }),
        fetch(`${baseUrl}/search/recentCosmetic`, { credentials: "include" }),
        // fetch(`${baseUrl}/search`, { credentials: "include" }),
      ]);

      // 응답 상태 확인
      if (!logRes.ok) {
        const errorText = await logRes.text();
        console.error("🔴 /recentLog 실패:", logRes.status, errorText);
      }

      if (!cardRes.ok) {
        const errorText = await cardRes.text();
        console.error("🔴 /recentCosmetic 실패:", cardRes.status, errorText);
      }

      if (!logRes.ok || !cardRes.ok)
        throw new Error("Failed to fetch recent data");

      const rawTags = await logRes.json();
      const rawCards = await cardRes.json();

      // 로그로 실제 구조 확인 (디버깅용)
      console.log("📦 rawTags:", rawTags);
      console.log("📦 rawCards:", rawCards);

      // const recentTags = rawTags?.data || [];
      // const recentCards = rawCards?.data || [];

      // ApiResponse 구조에서 data 필드만 추출
      const recentTags = Array.isArray(rawTags?.data) ? rawTags.data : [];
      const recentCards = Array.isArray(rawCards?.data) ? rawCards.data : [];

      console.log("📦 recentTags 응답:", recentTags);
      console.log("📦 recentCards 응답:", recentCards);

      set({ recentTags, recentCards });
    } catch (error) {
      console.error("🔴 Error fetching recent data:", error);
    }
  },

  removeTag: (tag) => {
    const updated = get().recentTags.filter((t) => t !== tag);
    set({ recentTags: updated });
  },

  removeCard: (url) => {
    const updated = get().recentCards.filter((u) => u !== url);
    set({ recentCards: updated });
  },
}));

// ✅ 새 함수: 검색 요청 + 리디스 저장 트리거
export const searchByName = async (name: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(
      `${baseUrl}/search?name=${encodeURIComponent(name)}`,
      {
        credentials: "include",
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("🔴 검색 실패:", response.status, errText);
      return;
    }

    const result = await response.json();
    console.log("✅ 검색 결과:", result);

    // 👉 필요 시 결과를 zustand 스토어에 저장하거나 라우팅
    return result;
  } catch (err) {
    console.error("🔴 검색 중 오류:", err);
  }
};
