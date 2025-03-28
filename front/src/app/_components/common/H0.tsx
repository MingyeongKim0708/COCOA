import React from "react";

const H0 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <h1 className={`text-head0 font-head ${className}`}>{children}</h1>;
};

export default H0;
