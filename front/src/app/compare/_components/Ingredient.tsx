import B5 from "@/app/_components/common/B5";
import T4 from "@/app/_components/common/T4";

export default function Ingredient({
  text,
  side,
}: {
  text: string;
  side: "left" | "right";
}) {
  return (
    <div
      className={`pt-6 text-size6 text-gray2 ${side === "left" ? "text-left" : "text-right"}`}
    >
      <hr />
      <T4 className="pt-6">성분</T4>
      <B5>{text}</B5>
    </div>
  );
}
