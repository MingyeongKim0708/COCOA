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
        className={`relative flex w-[22.5rem] rounded-[1.25rem] bg-brown4 p-[0.625rem] pb-3`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-3.5 text-brown1"
          onClick={onClose}
        >
          <X />
        </button>
        <div className="flex flex-col items-start">
          <div className="px-[0.625rem] py-[0.3125rem] text-size3 font-title text-brown1">
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
