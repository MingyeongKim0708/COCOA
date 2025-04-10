import { useEffect, useRef, useState } from "react";
import { WordWithComponent } from "../types/wordCloueTypes";
import {
  assignFontComponents,
  getAdjustedFontSize,
  getFontPx,
  getPxToRem,
  toWordArray,
} from "../utils/wordCloudUtils";
import cloud from "d3-cloud";
import {
  getBoundingBox,
  getCloudBoundingBox,
  insertMissingWords,
  isOverlapping,
} from "../engine/wordCloudLayoutEngine";

export const useWordCloud = (
  words: Record<string, number>,
  width: number,
  height: number,
) => {
  const [computedWords, setComputedWords] = useState<WordWithComponent[]>([]);
  const [scale, setScale] = useState<number>(1);
  const [box, setBox] = useState({
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
  });

  const prevWordsRef = useRef<string>("");
  const prevSizeRef = useRef<{ width: number; height: number }>({
    width,
    height,
  });

  useEffect(() => {
    const key = JSON.stringify(words);
    const sameWords = prevWordsRef.current === key;
    const sameSize =
      prevSizeRef.current.width === width &&
      prevSizeRef.current.height === height;

    if (sameWords && sameSize) {
      return;
    }

    prevWordsRef.current = key;
    prevSizeRef.current = { width, height };

    const topWords = toWordArray(words)
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);

    const withFont = assignFontComponents(topWords);

    const ratio = height / width;
    const virtualWidth = getPxToRem(40);
    const virtualHeight = getPxToRem(40 * ratio);

    cloud<WordWithComponent>()
      .size([virtualWidth, virtualHeight])
      .words(withFont)
      .padding(5)
      .font("Arial")
      .rotate(() => 0)
      .fontSize((d) => getAdjustedFontSize(d))
      .on("end", (results) => {
        const filtered: WordWithComponent[] = [];

        for (let i = 0; i < results.length; i++) {
          const current = results[i];
          const box = getBoundingBox(current.x ?? 0, current.y ?? 0, current);

          const overlaps = filtered.some((prev) => {
            const prevBox = getBoundingBox(prev.x ?? 0, prev.y ?? 0, prev);
            return isOverlapping(box, prevBox);
          });

          if (!overlaps) {
            filtered.push(current);
          }
        }

        const placedWords = filtered.map((w) => w.text);
        const missing = withFont.filter((w) => !placedWords.includes(w.text));
        const sortedMissing = [...missing].sort(
          (a, b) => getFontPx(b.FontTag) - getFontPx(a.FontTag),
        );

        const placed = insertMissingWords(
          filtered,
          sortedMissing,
          virtualWidth,
          virtualHeight,
        );

        if (placed.length === 0) return;

        const box = getCloudBoundingBox(placed);

        const scaleX = width / box.width;
        const scaleY = height / box.height;
        const MIN_SCALE = 0.1;
        const placedScale = Math.max(Math.min(scaleX, scaleY, 1), MIN_SCALE);

        const scaled = placed.map((w) => ({
          ...w,
          x: ((w.x ?? 0) - box.centerX) * placedScale,
          y: ((w.y ?? 0) - box.centerY) * placedScale,
        }));

        setBox(getCloudBoundingBox(scaled));
        setScale(placedScale);
        setComputedWords(scaled);
      })
      .start();
  }, [words, width, height]);

  return {
    computedWords,
    scale,
    box,
  };
};
