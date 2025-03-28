import React from "react";

const Tag = ({
  children,
  className,
  radius,
}: {
  children: string;
  className?: string;
  radius?: string;
}) => {
  const hasBgInClassName = className ? /\bbg-/.test(className) : false;

  return (
    <span
      className={`rounded-${radius} whitespace-nowrap ${hasBgInClassName ? "" : "bg-gray5"} px-2 py-[0.125rem] font-body ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
