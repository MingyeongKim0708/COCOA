import React from "react";

const B6 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <p className={`text-size6 font-body ${className}`}>{children}</p>;
};

export default B6;
