import React, { useEffect, useMemo, useRef, useState } from "react";
import WordCloud from "./WordCloud";
import T4 from "../common/T4";

interface CosmeticWordCloudProps {
  words: Record<string, number> | null;
  onWordClick: (word: string) => void;
  selectWord?: string | null;
  isFiltered?: boolean;
}

const CosmeticWordCloud = ({
  words,
  onWordClick,
  selectWord,
  isFiltered,
}: CosmeticWordCloudProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    console.log(words);
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleClickWord = (word: string) => {
    onWordClick(word);
  };

  return (
    <div ref={containerRef} className="relative aspect-[1.94] w-full">
      <div className="absolute inset-0 flex items-center justify-center">
        {size.width > 0 && size.height > 0 ? (
          words ? (
            <WordCloud
              words={words}
              onWordClick={(word) => handleClickWord(word)}
              selectWord={selectWord}
              isFiltered={isFiltered}
              width={size.width}
              height={size.height}
            />
          ) : (
            <T4
              children="충분한 데이터가 모이지 않았어요."
              className="text-center text-gray2"
            />
          )
        ) : null}
      </div>
    </div>
  );
};

export default CosmeticWordCloud;
