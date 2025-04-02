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
      className={`rounded-custom flex h-[3rem] w-[6rem] items-center justify-center ${selected ? "bg-pink1 text-white" : "border border-2 border-brown3 text-brown3"}`}
    >
      {label}
    </div>
  );
};

export default OptionButton;
