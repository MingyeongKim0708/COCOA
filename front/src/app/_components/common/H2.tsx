import React from "react";

const H2 = ({
  children,
  className,
  onClick,
}: {
  children: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <h2
      onClick={() => onClick?.()}
      className={`text-head2 font-head ${className}`}
    >
      {children}
    </h2>
  );
};

export default H2;
