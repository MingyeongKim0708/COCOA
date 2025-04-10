"use client";

import CompareReplaceModal from "@/app/compare/_components/CompareRelaceModal";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { ComparedCosmetic, CompareModalItem } from "@/types/compare";
import { BarChart2, Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductActionBarProps {
  productId: number;
  likeCount: number;
  liked: boolean;
}

const ProductActionBar = ({
  productId,
  likeCount,
  liked: initialLiked,
}: ProductActionBarProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [showModal, setShowModal] = useState(false);
  const [compareItems, setCompareItems] = useState<CompareModalItem[]>([]); // API 반환에 따라 타입 구체화 가능
  const [newItemId, setNewItemId] = useState<number | null>(null);

  // 이 부분 추가
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setCount(likeCount);
  }, [likeCount]);

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

  const toggleLike = async () => {
    try {
      const url = `${baseUrl}/cosmetic/${productId}/like`;

      if (liked) {
        // 관심 해제
        const res = await fetchWrapper(url, {
          method: "DELETE",
        });
        const result = await res.json();

        if (result.success) {
          setLiked(false);
          setCount((prev) => prev - 1);
        } else {
          alert(result.message);
        }
      } else {
        // 관심 등록
        const res = await fetchWrapper(url, {
          method: "POST",
        });
        const result = await res.json();

        if (result.success) {
          setLiked(true);
          setCount((prev) => prev + 1);
        } else {
          alert(result.message);
        }
      }
    } catch (error) {
      alert("요청 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleToggleLike = async () => {
    await toggleLike();
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
        onClick={handleToggleLike}
        className="flex cursor-pointer items-center gap-1"
      >
        <Heart size={16} fill={liked ? "#ff4848" : "none"} stroke="#ff4848" />
        <span>{count}</span>
      </button>
    </div>
  );
};

export default ProductActionBar;
