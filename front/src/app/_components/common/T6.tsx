import React from "react";

const T6 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <p className={`text-size6 font-title ${className}`}>{children}</p>;
};

export default T6;
