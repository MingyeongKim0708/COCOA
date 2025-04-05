import React from "react";

const B3 = ({
  children,
  className,
  onClick,
}: {
  children: string;
  className?: string;
  onClick: () => void;
}) => {
  return (
    <p
      onClick={() => onClick?.()}
      className={`text-size3 font-body ${className}`}
    >
      {children}
    </p>
  );
};

export default B3;
