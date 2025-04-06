import React from "react";

const T6 = ({
  children,
  className,
  onClick,
}: {
  children: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <p
      onClick={() => onClick?.()}
      className={`text-size6 font-title ${className}`}
    >
      {children}
    </p>
  );
};

export default T6;
