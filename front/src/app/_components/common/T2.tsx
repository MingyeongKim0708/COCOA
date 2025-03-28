import React from "react";

const T2 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <h4 className={`text-size2 font-title ${className}`}>{children}</h4>;
};

export default T2;
