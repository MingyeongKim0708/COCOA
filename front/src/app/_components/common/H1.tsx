import React from "react";

const H1 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <h1 className={`text-head1 font-head ${className}`}>{children}</h1>;
};

export default H1;
