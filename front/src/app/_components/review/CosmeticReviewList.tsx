import { Review } from "@/types/review";
import React, { useEffect, useState } from "react";
import T3 from "../common/T3";
import T4 from "../common/T4";
import ReviewCard from "./ReviewCard";
import { reviewDummyList } from "@/mocks/dummyReviews";

interface CosmeticReviewListProps {
  reviews: Review[];
  selectWord: string | null;
}

const CosmeticReviewList = ({
  reviews,
  selectWord,
}: CosmeticReviewListProps) => {
  return (
    <div className="pt-5">
      <div className="flex flex-row items-center justify-between">
        <T3 children={`리뷰 ${reviews?.length ?? 0}개`} />
      </div>
      {reviews.length > 0 &&
        reviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            review={review}
            // keyword={selectWord}
          />
        ))}
    </div>
  );
};

export default CosmeticReviewList;
