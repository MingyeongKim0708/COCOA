import { Word as D3Word } from "d3-cloud";

// D3에서 사용하는 기본 워드 타입
export interface Word extends D3Word {
  text: string;
  value: number;
}

// 컴포넌트를 포함한 확장 워드 타입
export interface WordWithComponent extends Word {
  FontTag: React.ComponentType<{
    children: string;
    className?: string;
  }>;
  color: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}
