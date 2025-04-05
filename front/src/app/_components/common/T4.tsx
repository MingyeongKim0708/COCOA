import React from "react";

const T4 = ({
  children,
  className,
  onClick,
}: {
  children: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <h6
      onClick={() => onClick?.()}
      className={`text-size4 font-title ${className}`}
    >
      {children}
    </h6>
  );
};

export default T4;
