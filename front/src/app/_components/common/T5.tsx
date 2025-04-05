import React from "react";

const T5 = ({
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
      className={`text-size5 font-title ${className}`}
    >
      {children}
    </p>
  );
};

export default T5;
