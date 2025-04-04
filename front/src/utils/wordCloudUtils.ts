import T1 from "../app/_components/common/T1";
import T2 from "../app/_components/common/T2";
import T3 from "../app/_components/common/T3";
import T4 from "../app/_components/common/T4";
import H0 from "../app/_components/common/H0";
import H1 from "../app/_components/common/H1";
import H2 from "../app/_components/common/H2";
import B3 from "../app/_components/common/B3";
import B4 from "../app/_components/common/B4";
import { Word, WordWithComponent } from "../types/wordCloueTypes";

// rem으로 px 계산
export const getPxToRem = (rem: number) => {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  return rootFontSize * rem;
};

// Json 객체를 배열로 변환
export const toWordArray = (data: Record<string, number>): Word[] =>
  Object.entries(data).map(([text, value]) => ({ text, value }));

// 폰트 컴포넌트, 색상 매핑 함수
export const assignFontComponents = (words: Word[]): WordWithComponent[] => {
  const sorted = [...words].sort((a, b) => b.value - a.value);
  const total = sorted.length;
  const topValue = sorted[0]?.value;

  return sorted.map((word, i) => {
    const ratio = i / total;

    if (i === 0) {
      return {
        ...word,
        FontTag: H2,
        color: "text-red2",
      };
    }

    if (word.value === topValue) {
      return {
        ...word,
        FontTag: H2,
        color: "text-red2",
      };
    }

    if (ratio < 0.3) {
      const tierTags = [T1, T2];
      return {
        ...word,
        FontTag: tierTags[i % tierTags.length],
        color: "text-pink1",
      };
    }

    if (ratio >= 0.3 && ratio < 0.7) {
      const tierTags = [T3, T4];
      return {
        ...word,
        FontTag: tierTags[i % tierTags.length],
        color: "text-pink2",
      };
    }

    const tierTags = [B3, B4];
    return {
      ...word,
      FontTag: tierTags[i % tierTags.length],
      color: "text-pink3",
    };
  });
};

// 폰트 크기 기준값
export const getFontPx = (FontTag: WordWithComponent["FontTag"]): number => {
  switch (FontTag) {
    case H0:
      return getPxToRem(3.9);
    case H1:
      return getPxToRem(3.25);
    case H2:
      return getPxToRem(2.925);
    case T1:
      return getPxToRem(2.6);
    case T2:
      return getPxToRem(1.95);
    case T3:
      return getPxToRem(1.625);
    case T4:
      return getPxToRem(1.3);
    case B3:
      return getPxToRem(1.625);
    case B4:
      return getPxToRem(1.3);
    default:
      return 16;
  }
};

export const getAdjustedFontSize = (word: WordWithComponent): number =>
  getFontPx(word.FontTag) * 1.2;

export const getWordSize = (word: WordWithComponent) => {
  const fontSize = getAdjustedFontSize(word);
  const width = word.text.length * fontSize * 0.75 + fontSize * 0.5;
  const height = fontSize;
  return { width, height };
};

export const checkDOMOverlap = (a: HTMLElement, b: HTMLElement): boolean => {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();

  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
};
