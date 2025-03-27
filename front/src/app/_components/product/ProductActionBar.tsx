"use client";

import { BarChart2, Heart } from "lucide-react";
import { useState } from "react";

interface ProductActionBarProps {
  likeCount: number;
  isLiked: boolean;
}

const ProductActionBar = ({
  likeCount,
  isLiked: initialLiked,
}: ProductActionBarProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);

  const handleCompare = () => {
    alert("비교함에 담았습니다!");
  };

  const toggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setCount((prev) => prev + 1);
    }
  };

  return (
    <div className="flex items-center gap-3 text-size4 font-title text-red2">
      <button
        type="button"
        onClick={handleCompare}
        className="flex cursor-pointer items-center gap-1"
      >
        <BarChart2 />
        <span>비교</span>
      </button>

      <button
        type="button"
        onClick={toggleLike}
        className="flex cursor-pointer items-center gap-1"
      >
        <Heart size={16} fill={isLiked ? "#ff4848" : "none"} stroke="#ff4848" />
        <span>{count}</span>
      </button>
    </div>
  );
};

export default ProductActionBar;
