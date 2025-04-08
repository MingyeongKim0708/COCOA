"use client";

import CompareReplaceModal from "@/app/compare/_components/CompareRelaceModal";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { ComparedCosmetic } from "@/types/compare";
import { BarChart2, Heart } from "lucide-react";
import { useState } from "react";

interface ProductActionBarProps {
  productId: number;
  likeCount: number;
  isLiked: boolean;
}

const ProductActionBar = ({
  productId,
  likeCount,
  isLiked: initialLiked,
}: ProductActionBarProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [showModal, setShowModal] = useState(false);
  const [compareItems, setCompareItems] = useState<any[]>([]); // API 반환에 따라 타입 구체화 가능
  const [newItemId, setNewItemId] = useState<number | null>(null);

  const handleCompare = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const response = await fetchWrapper(`${baseUrl}/compare-ids`, {
        method: "GET",
      });
      const ids: number[] = (await response.json()).data;
      console.log("레디스에 등록된 비교제품id : ", ids);

      if (ids.includes(productId)) {
        alert("이미 비교함에 등록된 제품입니다.");
        return;
      }

      // 비교함 등록
      if (ids.length < 2) {
        await fetchWrapper(`${baseUrl}/compare`, {
          method: "POST",
          body: JSON.stringify({
            originalItemId: null,
            newItemId: productId,
          }),
        });
        alert("비교함에 담았습니다!");
      }
      // 비교함 교체
      else {
        const modalResponse = await fetchWrapper(`${baseUrl}/compare-modal`, {
          method: "GET",
        });
        const modalData = await modalResponse.json();
        setCompareItems(modalData.data);
        setNewItemId(productId);
        setShowModal(true);
      }
    } catch (err) {
      alert("오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleReplace = async (replacedId: number, newId: number) => {
    try {
      await fetchWrapper(`${baseUrl}/compare`, {
        method: "POST",
        body: JSON.stringify({
          originalItemId: replacedId,
          newItemId: newId,
        }),
      });
      setShowModal(false);
      alert("비교 제품이 교체되었습니다.");
    } catch (err) {
      alert("교체 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const haddleToggleLike = () => {
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

      {showModal && newItemId !== null && (
        <CompareReplaceModal
          items={compareItems}
          newItemId={newItemId}
          onSelectReplace={handleReplace}
          onClose={() => setShowModal(false)}
        />
      )}

      <button
        type="button"
        onClick={haddleToggleLike}
        className="flex cursor-pointer items-center gap-1"
      >
        <Heart size={16} fill={isLiked ? "#ff4848" : "none"} stroke="#ff4848" />
        <span>{count}</span>
      </button>
    </div>
  );
};

export default ProductActionBar;
