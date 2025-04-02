import { AgeGroup, Gender, SkinTone, SkinType, User } from "@/types/user";
import { create } from "zustand";

export interface UserStore {
  user: User;
  keywords: JSON | null;
  interestProduct: number[] | null;
  latestProduct: number[] | null;
  searchLogs: string[] | null;

  setUser: (user: User) => void;
  setKeywords: (keywords: JSON) => void;
  setInterestProduct: (interest: number[]) => void;
  setLatestProduct: (latestProduct: number[]) => void;
  setSearchLogs: (searchLogs: string[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    id: 0,
    nickname: "철수",
    imageUrl: "https://placehold.co/600x400",
    ageGroup: AgeGroup.teen,
    gender: Gender.female,
    skinType: SkinType.dry,
    skinTone: SkinTone.spring_warm,
  },
  keywords: null,
  interestProduct: null,
  latestProduct: null,
  searchLogs: null,

  setUser: (user: User) => set({ user }),
  setKeywords: (keywords: JSON) => set({ keywords }),
  setInterestProduct: (interestProduct: number[]) => set({ interestProduct }),
  setLatestProduct: (latestProduct: number[]) => set({ latestProduct }),
  setSearchLogs: (searchLogs: string[]) => set({ searchLogs }),
}));
