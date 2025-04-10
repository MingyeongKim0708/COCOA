import T5 from "@/app/_components/common/T5";
import { CircleAlert } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const InfoHint = () => {
  const [showInfo, setShowInfo] = useState(false);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (hintRef.current && !hintRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <CircleAlert
        size={20}
        className="text-gray2"
        onClick={() => setShowInfo(!showInfo)}
      />
      {showInfo && (
        <div
          ref={hintRef}
          className="absolute bottom-full right-0 mb-2 w-[65vw] rounded-custom border border-brown2 bg-white p-2"
        >
          <T5 className="text-gray4">
            제품 관련 키워드를 수집하여 제공하는 것으로, COCOA에서는 관련 리뷰가
            존재하지 않을 수 있습니다.
          </T5>
        </div>
      )}
    </div>
  );
};

export default InfoHint;
