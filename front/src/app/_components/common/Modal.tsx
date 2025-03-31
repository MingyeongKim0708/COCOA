import React from "react";
import T3 from "./T3";
import { X } from "lucide-react";

const Modal = ({
  header,
  body,
  isOpen,
  onClose,
}: {
  header: React.ReactNode;
  body: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[0.125rem]"
      onClick={onClose}
    >
      <div
        className={`relative flex w-[22.5rem] rounded-[1.25rem] bg-brown4 p-[0.625rem]`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-[0] top-[-0.45rem] flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-full border border-brown2 bg-white text-brown1"
        >
          <X strokeWidth={2} size={24} />
        </button>
        <div className="flex flex-col items-start">
          <div className="px-[0.625rem] py-[0.3125rem] text-brown1">
            {header}
          </div>
          <div className="max-h-[18.5rem] min-h-[10.75rem] w-[21.25rem] overflow-y-auto rounded-[1.25rem] bg-white p-[0.625rem] text-start text-brown2">
            {body}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
