import React from "react";

const B1 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <p className={`text-size1 font-body ${className}`}>{children}</p>;
};

export default B1;
