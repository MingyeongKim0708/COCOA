import React from "react";

const T3 = ({
  children,
  className,
  onClick,
}: {
  children: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <h5
      onClick={() => onClick?.()}
      className={`text-size3 font-title ${className}`}
    >
      {children}
    </h5>
  );
};

export default T3;
