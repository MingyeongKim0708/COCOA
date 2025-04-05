import React from "react";

const B1 = ({
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
      className={`text-size1 font-body ${className}`}
    >
      {children}
    </p>
  );
};

export default B1;
