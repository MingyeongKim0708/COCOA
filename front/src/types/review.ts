import { Cosmetic } from "./cosmetic";
import { User } from "./user";

export interface Review {
  reviewId: number;
  content: string;
  satisfied: boolean;
  helpfulCount: number;
  user: User | null;
  cosmetic: Cosmetic | null;
  helpfulForMe: boolean;
  createdAt: string;
}
