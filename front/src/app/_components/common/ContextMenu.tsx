import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
  items: string[];
  onSelect: (item: string) => void;
  className?: string;
  onClose: () => void;
}

const ContextMenu = ({
  items,
  onSelect,
  className,
  onClose,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`rounded-custom absolute right-0 top-full mt-2 flex w-[6.25rem] flex-col gap-[0.3125rem] bg-gray5 py-[0.625rem] ${className}`}
    >
      {items.map((item, index) => {
        return (
          <div
            key={item}
            className={`flex flex-col items-center gap-[0.3125rem] ${item === "삭제하기" ? "text-red1" : ""}`}
          >
            <button onClick={() => onSelect(item)}>{item}</button>

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
