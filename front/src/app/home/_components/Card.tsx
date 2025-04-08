import React from "react";

interface CardProps {
  number: number | null;
  className?: string | null;
}

const Card = ({ number, className }: CardProps) => {
  return <div className={className!}>card {number}</div>;
};

export default Card;

// home에서 안씀..
