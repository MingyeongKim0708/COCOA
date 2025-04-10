import T3 from "@/app/_components/common/T3";
import ReviewCard from "@/app/_components/review/ReviewCard";
import { Review } from "@/types/review";
import { User } from "@/types/user";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchWrapper } from "@/lib/fetchWrapper";

interface PreviewMyReviewProps {
  user: User | null;
}

const PreviewMyReview = ({ user }: PreviewMyReviewProps) => {
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchReview = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetchWrapper(
        `${baseUrl}/reviews/user/${user?.id}?page=0`,
      );
      if (res.ok) {
        const resJson = await res.json();
        const reviews: Review[] = resJson.reviews;

        if (!Array.isArray(reviews)) {
          console.warn("리뷰 목록이 배열이 아님:", reviews);
          return;
        }

        const sortedReviews = reviews
          .slice()
          .sort(
            (a: Review, b: Review) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        const review = sortedReviews[0];

        setReview(review);
      } else {
        console.error("리뷰 가져오기 실패:", res.status);
      }
    };

    fetchReview();
  }, [user]);

  const handleGoToMyReaiews = () => {
    router.push(`/review/${user?.id}`);
  };

  if (!user) return null;
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-row justify-between"
        onClick={() => handleGoToMyReaiews()}
      >
        <T3 children="나의 리뷰" />
        <ChevronRight size={24} />
      </div>
      {review && <ReviewCard review={review} />}
    </div>
  );
};

export default PreviewMyReview;
