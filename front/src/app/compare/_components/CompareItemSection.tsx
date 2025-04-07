import { ComparedCosmetic } from "@/types/compare";
import Info from "./Info";
import { KeywordBar } from "./KeywordBar";
import Ingredient from "./Ingredient";

interface Props {
  data: ComparedCosmetic | null;
  side: "left" | "right";
  progress?: boolean;
}

export default function CompareItemSection({
  data,
  side,
  progress = false,
}: Props) {
  if (!data) {
    return (
      <div className="bg-gray2/20 flex h-[300px] items-center justify-center rounded-xl text-gray3">
        비교 제품 없음
      </div>
    );
  }

  const maxValue = Math.max(...data.top5Keywords.map((k) => k.count));

  return (
    <div>
      <Info data={data} />
      <div
        className={`w-[91%] pt-4 ${side === "left" ? "mr-auto" : "ml-auto"}`}
      >
        {data.top5Keywords.map((k, idx) => (
          <KeywordBar
            key={k.keyword}
            keyword={k.keyword}
            value={k.count}
            matched={k.matched}
            side={side}
            progress={progress}
            maxValue={maxValue}
            index={idx}
          />
        ))}
      </div>
      <Ingredient text={data.ingredients} side={side} />
    </div>
  );
}
