import React from "react";

const B4 = ({
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
      className={`text-size4 font-body ${className}`}
    >
      {children}
    </p>
  );
};

export default B4;
