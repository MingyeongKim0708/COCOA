"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface WriteReviewButtonProps {
  cosmeticId: number;
}

const WriteReviewButton = ({ cosmeticId }: WriteReviewButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/review/write?cosmeticId=${cosmeticId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-32 right-4 z-50 rounded-full bg-pink1 p-2 text-white shadow-md"
      aria-label="리뷰 작성하기"
    >
      <Pencil size={24} />
    </button>
  );
};

export default WriteReviewButton;
