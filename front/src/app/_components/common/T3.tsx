import React from "react";

const T3 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <h5 className={`text-size3 font-title ${className}`}>{children}</h5>;
};

export default T3;
