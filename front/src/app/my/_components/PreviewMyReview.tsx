import T3 from "@/app/_components/common/T3";
import ReviewCard from "@/app/_components/review/ReviewCard";
import { reviewCosmetic, reviewUser } from "@/mocks/dummyReviews";
import { Review } from "@/types/review";
import { User } from "@/types/user";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchWrapper } from "@/lib/fetchWrapper";

interface PreviewMyReviewProps {
  user: User;
}

const PreviewMyReview = ({ user }: PreviewMyReviewProps) => {
  const router = useRouter();
  const [review, setReview] = useState<Review | null>();

  useEffect(() => {
    //사용자 리뷰 조회하는 api 사용해서 가장 최근 작성한 리뷰만 띄우기로 함
    const fetchReview = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetchWrapper(`${baseUrl}/user/${user.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const {
          data: { ReviewList: reviews },
        } = await res.json();

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

    setReview(reviewCosmetic);

    // fetchReview(); api완성되면 주석 해제
  }, []);

  const handleGoToMyReaiews = () => {
    router.push(`/my/${user.id}`);
  };

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
