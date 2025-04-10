import { Cosmetic } from './cosmetic';
import { Review } from './review';

export interface CosmeticDetail {
  cosmetic: Cosmetic;
  reviews: Review[];
}