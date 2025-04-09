"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWordCloud } from "../../../hooks/useWordCloud";
import { useUserStore } from "@/stores/UserStore";
import { getPxToRem } from "@/utils/wordCloudUtils";
import { WordWithComponent } from "@/types/wordCloueTypes";

interface WordCloudProps {
  words: Record<string, number>;
  width?: number;
  height?: number;
  onWordClick?: (word: string) => void;
  selectWord?: string | null;
  isFiltered?: boolean;
}

const WordCloud = ({
  words,
  width = 330,
  height = 170,
  onWordClick,
  selectWord,
  isFiltered,
}: WordCloudProps) => {
  const [scale, setScale] = useState<number>(1);
  const [computedWords, setComputedWords] = useState<WordWithComponent[]>([]);
  const [boxSize, setBoxSize] = useState({ width: 660, height: 340 });

  const cloud = useWordCloud(words, width, height);

  useEffect(() => {
    const computedWords = cloud.computedWords;
    setComputedWords(computedWords);
    const box = cloud.box;

    if (box.width === 0 || box.height === 0) return;
    if (!width || !height || box.width === 0 || box.height === 0) return;
    const scaleX = width / box.width;
    const scaleY = height / box.height;
    const placedScale = Math.min(scaleX, scaleY, 1);

    console.log(box);
    setBoxSize({ width: box.width, height: box.height });
    setScale(placedScale);
    console.log("out scale", scale);
  }, [cloud.computedWords, cloud.box.width, cloud.box.height]);

  const raw = useUserStore().keywords;
  const keywords: string[] = Object.keys(raw ? raw : []);
  const matchedWords: string[] = Object.keys(words).filter((w) =>
    keywords.includes(w),
  );

  return (
    <div
      id="wordcloud-container"
      className="relative origin-center"
      style={{
        width: boxSize.width,
        height: boxSize.height,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      <div
        id="inner-box"
        className="absolute left-1/2 top-1/2"
        style={{
          width: boxSize.width,
          height: boxSize.height,
          transform: `translate(-50%, -50%) `,
          transformOrigin: "center",
        }}
      >
        {computedWords.map(({ text, x = 0, y = 0, FontTag, color, size }) => {
          const isSelected = selectWord === text;
          const isMatched = matchedWords.includes(text);

          let textColor = color;

          if (selectWord) {
            textColor = isSelected ? "text-red1" : "text-gray5";
          } else if (isFiltered) {
            if (!isMatched) textColor = "text-gray5";
          }

          return (
            <div
              key={text}
              className="word absolute -translate-x-1/2 -translate-y-1/2 transform"
              style={{
                left: boxSize.width / 2 + x,
                top: boxSize.height / 2 + y,
                transform: `translate(-50%, -50%) scale(${scale * 0.96})`,
                transformOrigin: "center",
              }}
              onClick={() => onWordClick?.(text)}
            >
              <FontTag
                className={`${textColor} inline-block whitespace-nowrap text-center`}
              >
                {text}
              </FontTag>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordCloud;
