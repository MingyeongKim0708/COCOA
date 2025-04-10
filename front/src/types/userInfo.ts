import { User } from "./user";

export interface UserWithKeywords {
  user: User;
  keywords: Record<string, number> | null;
}
