import React, { useEffect, useMemo, useRef, useState } from "react";
import WordCloud from "./WordCloud";
import T4 from "../common/T4";

interface UserWordCloudProps {
  words: Record<string, number> | null;
}

const UserWordCloud = ({ words }: UserWordCloudProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    console.log("유저 워드클라우드");
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height }); // px 단위
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const layoutSize = useMemo(() => {
    return {
      width: Math.round(size.width * 0.8),
      height: Math.round(size.height * 0.8),
    };
  }, [size.width, size.height]);

  return (
    <div ref={containerRef} className="relative h-fit w-fit">
      <img
        src="/images/word-cloud-border.svg"
        alt="워드클라우드 테두리"
        className="w-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {size.width > 0 && size.height > 0 && words ? (
          <div className="flex h-[80%] w-[80%] items-center justify-center">
            <WordCloud
              words={words}
              width={layoutSize.width}
              height={layoutSize.height}
            />
          </div>
        ) : (
          <T4
            children="리뷰를 작성하면...어떤 일이 생길까?"
            className="text-center text-gray2"
          />
        )}
      </div>
    </div>
  );
};

export default UserWordCloud;
