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

// 검색 요청 + 레디스 저장 트리거
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

export const saveRecentCosmetic = async (id: number, url: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}/search/recentCosmetic/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ imageUrl1: url }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("🔴 최근 이미지 저장 실패:", res.status, text);
      return;
    }

    console.log("✅ 최근 이미지 저장 성공:", `${id}|${url}`);
  } catch (err) {
    console.error("🔴 최근 이미지 저장 중 오류:", err);
  }
};
