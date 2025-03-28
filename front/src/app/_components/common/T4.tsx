import React from "react";

const T4 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <h6 className={`text-size4 font-title ${className}`}>{children}</h6>;
};

export default T4;
