// ReviewImageGrid.tsx

import { X } from "lucide-react";

interface ReviewImageGridProps {
  files?: File[];
  urls?: string[];
  onRemove?: (index: number) => void;
  onAdd?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean; // 등록/수정 화면 여부
  maxCount?: number;
}

export default function ReviewImageGrid({
  files,
  urls,
  onRemove,
  onAdd,
  editable = false,
  maxCount = 5,
}: ReviewImageGridProps) {
  const previews = [
    ...(urls ?? []),
    ...(files ? files.map((file) => URL.createObjectURL(file)) : []),
  ];

  return (
    <div className="flex flex-row gap-3 overflow-x-auto py-2">
      {previews.map((src, idx) => (
        <div key={idx} className="relative block w-24 flex-shrink-0">
          <img
            src={src}
            alt={`img-${idx}`}
            className="h-24 w-24 flex-shrink-0 rounded-lg border border-gray3 object-fill"
          />
          {editable && onRemove && (
            <button
              onClick={() => onRemove(idx)}
              className="absolute -right-2 -top-2 rounded-full bg-gray4 p-[2px]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}

      {/* + 버튼 */}
      {editable && previews.length < maxCount && (
        <>
          <label
            htmlFor="image-upload"
            className="flex h-24 w-24 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray2 text-size2 text-gray2"
          >
            +
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onAdd}
          />
        </>
      )}
    </div>
  );
}
