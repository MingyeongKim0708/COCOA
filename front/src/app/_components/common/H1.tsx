import React from "react";

const H1 = ({
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
      className={`text-head1 font-head ${className}`}
    >
      {children}
    </h1>
  );
};

export default H1;
