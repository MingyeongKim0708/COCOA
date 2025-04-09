import B5 from "@/app/_components/common/B5";
import Modal from "@/app/_components/common/Modal";
import T4 from "@/app/_components/common/T4";
import { useState } from "react";

export default function IngredientText({
  text,
  side,
}: {
  text: string;
  side: "left" | "right";
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`pt-5 text-size6 text-gray2 ${side === "left" ? "text-left" : "text-right"}`}
    >
      <hr />
      <T4 className="pt-6">성분</T4>
      <B5 className="line-clamp-6">{text}</B5>
      <button
        onClick={() => setIsOpen(true)}
        className="text-size6 font-semibold text-gray2 underline"
      >
        ...더보기
      </button>
      {/* 모달 */}
      <Modal
        header="화장품 성분"
        body={<B5 className="whitespace-pre-line">{text}</B5>}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
