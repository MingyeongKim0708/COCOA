import Tag from "@/app/_components/common/Tag";
import { useEffect, useRef, useState } from "react";

export function KeywordMarquee({
  keywords,
  color,
}: {
  keywords: string[];
  color: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.scrollWidth / 2; // 단일 콘텐츠 너비
      setDuration(width / 60); // speed 60
    }
  }, [keywords]);
  return (
    <div
      className="inline-flex gap-3 pb-3"
      ref={containerRef}
      style={{
        animation: `marquee ${duration}s linear infinite`,
      }}
    >
      {/* 단어들을 30 번 반복해서 무한 루프처럼 보이게 */}
      {Array.from({ length: 30 }).flatMap((_, i) =>
        keywords.map((kw, idx) => (
          <Tag key={`${i}-${idx}`} className={`${color} px-3 py-1 text-center`}>
            {kw}
          </Tag>
        )),
      )}
    </div>
  );
}
