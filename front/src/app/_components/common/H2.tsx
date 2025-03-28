import React from "react";

const H2 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <h2 className={`text-head2 font-head ${className}`}>{children}</h2>;
};

export default H2;
