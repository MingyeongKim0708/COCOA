import React from "react";

const H0 = ({
  children,
  className,
  onClick,
}: {
  children: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <h1
      onClick={() => onClick?.()}
      className={`text-head0 font-head ${className}`}
    >
      {children}
    </h1>
  );
};

export default H0;
