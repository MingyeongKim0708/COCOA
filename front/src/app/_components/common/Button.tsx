import React from "react";

const Button = ({
  children,
  onClick,
  disabled,
  className,
}: {
  children: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-[2.5rem] w-[20rem] rounded-md px-8 py-[0.5625rem] text-size4 font-title text-white ${disabled ? "bg-gray4" : "bg-red2"} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
