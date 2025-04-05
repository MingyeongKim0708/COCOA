"use client";

import React, { useEffect, useRef, useState } from "react";
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
  width = 20.625,
  height = 10.625,
  onWordClick,
  selectWord,
  isFiltered,
}: WordCloudProps) => {
  const [pxWidth, setPxWidth] = useState<number>(330);
  const [pxHeight, setPxHeight] = useState<number>(170);
  const [scale, setScale] = useState<number>(1);
  const [computedWords, setComputedWords] = useState<WordWithComponent[]>([]);
  const boxWidthRef = useRef<number>(660);
  const boxHeightRef = useRef<number>(340);
  const cloud = useWordCloud(words, pxWidth, pxHeight);

  useEffect(() => {
    const pxWidth = getPxToRem(width);
    const pxHeight = getPxToRem(height);
    setPxWidth(pxWidth);
    setPxHeight(pxHeight);
  }, [width, height]);

  useEffect(() => {
    const computedWords = cloud.computedWords;
    setComputedWords(computedWords);
    const box = cloud.box;

    if (box.width === 0 || box.height === 0) return;

    const scaleX = pxWidth / box.width;
    const scaleY = pxHeight / box.height;
    const placedScale = Math.min(scaleX, scaleY, 1);

    console.log(box);

    boxWidthRef.current = box.width;
    boxHeightRef.current = box.height;
    setScale(placedScale);
    console.log("out scale", scale);
  }, [cloud]);

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
        width: `${width}rem`,
        height: `${height}rem`,
      }}
    >
      <div
        id="inner-box"
        className="absolute left-1/2 top-1/2"
        style={{
          width: boxWidthRef.current,
          height: boxHeightRef.current,
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
                left: boxWidthRef.current / 2 + x,
                top: boxHeightRef.current / 2 + y,
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
