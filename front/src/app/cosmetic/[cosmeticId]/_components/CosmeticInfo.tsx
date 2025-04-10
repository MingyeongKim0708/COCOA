"use client";

import ProductActionBar from "@/app/_components/product/ProductActionBar";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import Modal from "@/app/_components/common/Modal";
import T3 from "@/app/_components/common/T3";
import B4 from "@/app/_components/common/B4";
import { Cosmetic } from "@/types/cosmetic";

interface Props {
  cosmetic: Cosmetic;
}

const CosmeticInfo = ({ cosmetic }: Props) => {
  const [activeModal, setActiveModal] = useState<"ingredient" | null>(null);

  return (
    <div>
      {/* 카테고리 + 찜/비교 버튼 */}
      <div className="relative mt-4">
        <div className="flex items-center text-size3 font-bold text-gray1">
          <span>{cosmetic.category.majorCategory}</span>
          <ChevronRight size={20} className="inline"></ChevronRight>
          <span>{cosmetic.category.middleCategory}</span>
        </div>
        <div className="absolute right-0 top-0">
          <ProductActionBar
            productId={cosmetic.cosmeticId}
            likeCount={cosmetic.likeCount}
            liked={cosmetic.liked}
          />
        </div>
      </div>

      {/* 제품 이름 */}
      <div className="my-3">
        <p className="text-size2 font-bold text-gray1">{cosmetic.brand}</p>
        <p className="text-size2 text-gray1">{cosmetic.name}</p>
      </div>

      {/* 성분 요약 */}
      <div className="flex items-center text-size5 text-gray4">
        <span className="mr-2 shrink-0 font-bold text-gray4">성분</span>
        <span className="truncate">{cosmetic.ingredient}</span>
        <button
          type="button"
          onClick={() => setActiveModal("ingredient")}
          className="shrink-0 text-pink3"
        >
          더보기
        </button>
      </div>

      {/* 모달 */}
      <Modal
        header={<T3>화장품 성분</T3>}
        body={
          <B4
            className="whitespace-pre-line leading-relaxed"
            children={cosmetic.ingredient}
          />
        }
        isOpen={activeModal === "ingredient"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default CosmeticInfo;
