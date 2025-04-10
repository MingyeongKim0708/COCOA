import { AgeGroup, Gender, SkinTone, SkinType, User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserStore {
  user: User | null;
  keywords: Record<string, number> | null;

  setUser: (user: User) => void;
  setKeywords: (keywords: Record<string, number> | null) => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      keywords: null,

      setUser: (user: User) => set({ user }),
      setKeywords: (keywords: Record<string, number> | null) =>
        set({ keywords }),
    }),
    {
      name: "user-storage",
    },
  ),
);
