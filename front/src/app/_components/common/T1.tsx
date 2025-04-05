import React from "react";

const T1 = ({
  children,
  className,
  onClick,
}: {
  children: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <h3
      onClick={() => onClick?.()}
      className={`text-size1 font-title ${className}`}
    >
      {children}
    </h3>
  );
};

export default T1;
