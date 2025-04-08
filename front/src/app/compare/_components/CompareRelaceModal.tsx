// CompareReplaceModal.tsx
"use client";
import { X } from "lucide-react";
import { useEffect } from "react";
import { CompareModalItem } from "@/types/compare";
import T4 from "@/app/_components/common/T4";
import T3 from "@/app/_components/common/T3";
import B4 from "@/app/_components/common/B4";

interface CompareReplaceModalProps {
  items: CompareModalItem[]; // 현재 비교 중인 2개
  newItemId: number; // 새로 추가하려는 제품 ID
  onSelectReplace: (replaceId: number, newId: number) => void;
  onClose: () => void;
}

export default function CompareReplaceModal({
  items,
  newItemId,
  onSelectReplace,
  onClose,
}: CompareReplaceModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 mb-24 flex items-end justify-center">
      <div className="w-[90%] rounded-2xl bg-brown4 p-5">
        <div className="flex items-start justify-between">
          <div>
            <T4 className="text-lg font-bold text-brown1">
              제품 비교함이 꽉 찼습니다.
            </T4>
            <T3 className="pt-1 text-sm text-brown1">
              제품 한 개를 선택해 교체해주세요.
            </T3>
          </div>
          <button onClick={onClose} className="text-brown1">
            <X size={24} />
          </button>
        </div>

        {/* 비교 아이템 */}
        <div className="grid grid-cols-2 gap-4 pt-3">
          {items.map((item) => (
            <button
              key={item.itemId}
              onClick={() => onSelectReplace(item.itemId, newItemId)}
              className="flex flex-col items-center rounded-xl bg-white p-3 transition hover:shadow-md"
            >
              <div className="relative aspect-[1/1] w-full">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="rounded-md object-contain"
                />
                <div className="bg-black/30 absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">⇄</span>
                </div>
              </div>
              <div className="w-full pt-2 text-left">
                <T4 className="truncate text-sm font-semibold text-black">
                  {item.brand}
                </T4>
                <B4 className="line-clamp-2 text-xs text-gray1">{item.name}</B4>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
