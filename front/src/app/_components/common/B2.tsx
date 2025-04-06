import React from "react";

const B2 = ({
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
      className={`text-size2 font-body ${className}`}
    >
      {children}
    </p>
  );
};

export default B2;
