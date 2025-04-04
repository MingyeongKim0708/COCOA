import { CosmeticInfo } from "./cosmeticInfo";
import { User } from "./user";

export interface Review {
  reviewId: number;
  userId: number;
  cosmeticId: number;
  content: string;
  satisfied: boolean;
  helpfulCount: number;
  user: User | null;
  cosmetic: CosmeticInfo | null;
  helpfulForMe: boolean;
  createdAt: string;
}
