import { AgeGroup, Gender, SkinTone, SkinType, User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserStore {
  user: User;
  keywords: Record<string, number> | null;

  setUser: (user: User) => void;
  setKeywords: (keywords: Record<string, number> | null) => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: {
        id: 0,
        nickname: "철수",
        imageUrl: "https://placehold.co/600x400",
        ageGroup: AgeGroup.teen,
        gender: Gender.female,
        skinType: SkinType.dry,
        skinTone: SkinTone.spring_warm,
      },
      keywords: { 촉촉함: 1 },

      setUser: (user: User) => set({ user }),
      setKeywords: (keywords: Record<string, number> | null) =>
        set({ keywords }),
    }),
    {
      name: "user-storage",
    },
  ),
);
