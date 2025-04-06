import React from "react";

const B6 = ({
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
      className={`text-size6 font-body ${className}`}
    >
      {children}
    </p>
  );
};

export default B6;
