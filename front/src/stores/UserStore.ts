import { create } from "zustand";

export interface UserStore {
  userId: number | null;

  setUserId: (userId: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,

  setUserId: (id) => set({ userId: id }),
}));
