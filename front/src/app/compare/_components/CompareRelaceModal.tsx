// CompareReplaceModal.tsx
"use client";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";

interface CompareItem {
  cosmeticId: number;
  imageUrl: string;
  brand: string;
  name: string;
  description: string;
}

interface CompareReplaceModalProps {
  items: CompareItem[]; // 현재 비교 중인 2개
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
    <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-[90%] max-w-xl rounded-2xl bg-[#f5efed] p-5">
        {/* 모달 헤더 */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold text-red2">
              제품 비교함이 꽉 찼습니다.
            </p>
            <p className="text-gray6 pt-1 text-sm">
              제품 한 개를 선택해 교체해주세요.
            </p>
          </div>
          <button onClick={onClose} className="text-gray5 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* 비교 아이템 */}
        <div className="grid grid-cols-2 gap-4 pt-6">
          {items.map((item) => (
            <button
              key={item.cosmeticId}
              onClick={() => onSelectReplace(item.cosmeticId, newItemId)}
              className="flex flex-col items-center rounded-xl bg-white p-3 transition hover:shadow-md"
            >
              <div className="relative aspect-[1/1] w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="rounded-md object-contain"
                />
                <div className="bg-black/30 absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">⇄</span>
                </div>
              </div>
              <div className="w-full pt-2 text-left">
                <p className="truncate text-sm font-semibold text-black">
                  {item.brand}
                </p>
                <p className="text-gray6 truncate text-xs">{item.name}</p>
                <p className="truncate pt-1 text-xs text-gray5">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
