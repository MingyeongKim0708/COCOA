import React from "react";

const B4 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <p className={`text-size4 font-body ${className}`}>{children}</p>;
};

export default B4;
