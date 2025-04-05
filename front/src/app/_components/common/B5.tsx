import React from "react";

const B5 = ({
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
      className={`text-size5 font-body ${className}`}
    >
      {children}
    </p>
  );
};

export default B5;
