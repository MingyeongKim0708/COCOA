import React from "react";

const T5 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <p className={`text-size5 font-title ${className}`}>{children}</p>;
};

export default T5;
