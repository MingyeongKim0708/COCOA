import { WordWithComponent } from "../types/wordCloueTypes";
import { getAdjustedFontSize, getWordSize } from "../utils/wordCloudUtils";

// 키워드 중심 좌표(x, y) 기준으로 단어 위치 좌표를 계산
export const getBoundingBox = (
  x: number,
  y: number,
  word: WordWithComponent,
): { left: number; right: number; top: number; bottom: number } => {
  const fontSize = getAdjustedFontSize(word);
  const w = word.text.length * fontSize * 0.75 + fontSize * 0.5;
  const h = fontSize * 1.2;
  return {
    left: x - w / 2,
    right: x + w / 2,
    top: y - h / 2,
    bottom: y + h / 2,
  };
};

// 클라우드의 전체 영역 계산
export const getCloudBoundingBox = (words: WordWithComponent[]) => {
  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;

  for (const word of words) {
    const { width, height } = getWordSize(word);
    const x = word.x ?? 0;
    const y = word.y ?? 0;

    minX = Math.min(minX, x - width / 2);
    maxX = Math.max(maxX, x + width / 2);
    minY = Math.min(minY, y - height / 2);
    maxY = Math.max(maxY, y + height / 2);
  }

  return {
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
};

// 겹침 판단
export const isOverlapping = (
  boxA: ReturnType<typeof getBoundingBox>,
  boxB: ReturnType<typeof getBoundingBox>,
): boolean => {
  return !(
    boxA.right < boxB.left ||
    boxA.left > boxB.right ||
    boxA.bottom < boxB.top ||
    boxA.top > boxB.bottom
  );
};

// 누락 단어들 재배치
export const insertMissingWords = (
  placed: WordWithComponent[],
  missing: WordWithComponent[],
  width: number,
  height: number,
): WordWithComponent[] => {
  const result = [...placed];
  const existingBoxes = result.map((w) =>
    getBoundingBox(w.x ?? 0, w.y ?? 0, w),
  );

  for (const word of missing) {
    const radiusStep = 4;
    const angleStep = 6;
    const maxRadius = Math.min(width, height) / 2;
    let placed = false;

    for (let r = 0; r <= maxRadius; r += radiusStep) {
      for (let angle = 0; angle < 360; angle += angleStep) {
        const rad = (angle * Math.PI) / 180;
        const x = r * Math.cos(rad);
        const y = r * Math.sin(rad);
        const box = getBoundingBox(x, y, word);

        const overlaps = existingBoxes.some((b) => isOverlapping(box, b));

        if (!overlaps) {
          word.x = x;
          word.y = y;
          result.push({ ...word });
          existingBoxes.push(box);
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
  }

  return result;
};
