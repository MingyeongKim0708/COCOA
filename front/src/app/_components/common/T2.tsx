import React from "react";

const T2 = ({
  children,
  className,
  onClick,
}: {
  children: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <h4
      onClick={() => onClick?.()}
      className={`text-size2 font-title ${className}`}
    >
      {children}
    </h4>
  );
};

export default T2;
