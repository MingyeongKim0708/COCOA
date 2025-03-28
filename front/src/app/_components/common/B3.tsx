import React from "react";

const B3 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <p className={`text-size3 font-body ${className}`}>{children}</p>;
};

export default B3;
