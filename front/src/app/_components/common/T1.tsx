import React from "react";

const T1 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <h3 className={`text-size1 font-title ${className}`}>{children}</h3>;
};

export default T1;
