import React from "react";

interface ContextMenuProps {
  items: string[];
  onSelect: (item: string) => void;
  className?: string;
}

const ContextMenu = ({ items, onSelect, className }: ContextMenuProps) => {
  return (
    <div
      className={`rounded-custom flex w-[6.25rem] flex-col gap-[0.3125rem] bg-gray5 py-[0.625rem] ${className}`}
    >
      {items.map((item, index) => {
        return (
          <div
            className={`flex flex-col items-center gap-[0.3125rem] ${item === "삭제하기" ? "text-red1" : ""}`}
          >
            <button key={item} onClick={() => onSelect(item)}>
              {item}
            </button>

            {index < items.length - 1 ? (
              <div className="h-[0.0625rem] w-[5rem] bg-gray2" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ContextMenu;
