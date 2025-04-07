import B6 from "@/app/_components/common/B6";
import T5 from "@/app/_components/common/T5";
import { Crown } from "lucide-react";

interface KeywordBarProps {
  keyword: string;
  value: number;
  matched: boolean;
  side: "left" | "right";
  progress: boolean;
  maxValue: number;
  index: number;
}

export function KeywordBar({
  keyword,
  value,
  matched,
  side,
  progress,
  maxValue,
  index,
}: KeywordBarProps) {
  const widthPercent = (value / maxValue) * 100;
  const colorClass =
    index === 0 ? "bg-pink1" : index < 4 ? "bg-pink3" : "bg-brown4";
  const roundedClass = side === "left" ? "rounded-r-lg" : "rounded-l-lg";

  return (
    <div className="mb-4">
      <div
        className={`flex items-center ${
          side === "left" ? "justify-start" : "justify-end"
        }`}
      >
        {side === "left" && (
          <T5
            className={`min-w-[3.2rem] items-center text-left leading-[1rem] ${matched ? "text-pink1" : ""}`}
          >
            {keyword}
          </T5>
        )}
        <div
          className={`relative h-5 transition-all duration-700 ${roundedClass} ${
            side === "left" ? "origin-left" : "origin-right"
          } ${colorClass}`}
          style={{ width: progress ? `${widthPercent}%` : "0%" }}
        >
          {progress && (
            <B6
              className={`item-center absolute top-1/2 -translate-y-1/2 text-center text-white ${
                side === "left" ? "right-1" : "left-1"
              }`}
            >
              {value}
            </B6>
          )}
          {index === 0 && (
            <span
              className={`absolute top-1/2 -translate-y-1/2 ${
                side === "left" ? "-right-5" : "-left-5"
              }`}
            >
              <Crown size={16} color="gold" />
            </span>
          )}
        </div>
        {side === "right" && (
          <T5
            className={`min-w-[3.2rem] items-center text-right leading-[1rem] ${matched ? "text-pink1" : ""}`}
          >
            {keyword}
          </T5>
        )}
      </div>
    </div>
  );
}
