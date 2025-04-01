import React from "react";

const B2 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <p className={`text-size2 font-body ${className}`}>{children}</p>;
};

export default B2;
