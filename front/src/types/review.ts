import { Cosmetic } from "./cosmetic";
import { User } from "./user";

export interface Review {
  reviewId: number;
  user: User | null;
  cosmetic: Cosmetic | null;
  content: string;
  satisfied: boolean;
  imageUrls: string[];
  helpfulCount: number;
  helpfulForMe: boolean;
  createdAt: string;
}
