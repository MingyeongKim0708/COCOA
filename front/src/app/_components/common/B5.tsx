import React from "react";

const B5 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <p className={`text-size5 font-body ${className}`}>{children}</p>;
};

export default B5;
