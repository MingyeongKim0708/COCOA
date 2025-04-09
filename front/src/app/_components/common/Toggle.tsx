"use client";
import React from "react";

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const Toggle = ({ isOn, onToggle }: ToggleProps) => {
  return (
    <div className="flex items-center">
      <div
        onClick={onToggle}
        className={`flex h-[1.125rem] w-9 cursor-pointer items-center rounded-full px-1 transition-colors ${
          isOn ? "bg-red2" : "bg-gray4"
        }`}
      >
        <div
          className={`h-[0.8rem] w-[0.8rem] rounded-full bg-white transition-transform duration-300 ${
            isOn ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
};

export default Toggle;
