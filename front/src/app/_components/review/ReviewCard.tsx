import { useRouter } from "next/router";
import ReviewProductInfo from "./ReviewProductInfo";
import ReviewUserInfo from "./ReviewUserInfo";
import type { Review } from "@/types/review";
import HelpfulButton from "./HelpfulButton";
import { useState } from "react";
import ContextMenu from "../common/ContextMenu";
import { EllipsisVertical } from "lucide-react";
import B4 from "../common/B4";
import B5 from "../common/B5";

interface ReviewProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewProps) => {
  // const router = useRouter();
  // const isUserPage = router.pathname.startsWith("/user");
  // const isCosmeticPage = router.pathname.startsWith("/cosmetic");
  const isUserPage = review.user != null ? true : false;
  const isCosmeticPage = review.cosmetic != null ? true : false;

  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [helpfulForMe, setHelpfulForMe] = useState(review.helpfulForMe);

  const items = ["수정하기", "삭제하기"];

  const handleSelect = (item: string) => {
    console.log("선택했다:", item);
    setMenuOpen(false);
  };

  const handleHelpful = async () => {
    if (isLoading) return; // 연타 방지
    if (helpfulCount < 0) return; // 만약을 위한 예외 처리

    try {
      setIsLoading(true); // 요청 시작
      if (helpfulForMe) {
        // await fetch(`/api/review/${review.reviewId}/helpful`, {
        //   method: "DELETE",
        // });
        setHelpfulCount((c) => c - 1);
      } else {
        // await fetch(`/api/review/${review.reviewId}/helpful`, {
        //   method: "POST",
        // });
        setHelpfulCount((c) => c + 1);
      }
      setHelpfulForMe((f) => !f);
    } catch (err) {
      alert("도움이 됨 요청 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false); // 요청 종료
    }
  };

  return (
    <div className="relative flex w-full flex-col gap-y-2 py-2 text-start">
      <ReviewProductInfo cosmetic={review.cosmetic} />
      <ReviewUserInfo user={review.user} />
      <div className="gap-1 py-1">
        {review.satisfied ? (
          <B5 children="이 회원님은 제품에 만족했어요" className="text-pink1" />
        ) : (
          <B5
            children="이 회원님은 제품에 만족하지 않았어요"
            className="text-gray2"
          />
        )}
        <B4 children={review.content} />
      </div>
      <div className="flex justify-between p-2">
        <HelpfulButton
          helpfulCount={helpfulCount}
          helpfulForMe={helpfulForMe}
          onClick={() => handleHelpful()}
        />
        <div className="flex items-center justify-between gap-1">
          <B5 children={review.createdAt} className="text-gray4" />
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            <EllipsisVertical size={20} />
          </button>
          {menuOpen && (
            <ContextMenu
              items={items}
              onSelect={handleSelect}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
