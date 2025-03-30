import React from "react";

const OptionButton = ({
  id,
  label,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`rounded-custom h-[2.5rem] w-[5rem] py-[0.5625rem] ${selected ? "bg-pink1 text-white" : "border border-2 border-brown3 text-brown3"}`}
    >
      {label}
    </div>
  );
};

export default OptionButton;
