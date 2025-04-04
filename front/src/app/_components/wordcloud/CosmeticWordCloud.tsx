import React, { useEffect, useState } from "react";
import WordCloud from "./WordCloud";

interface CosmeticWordCloudProps {
  words: Record<string, number>;
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
  const [selecteWord, setSelecteWord] = useState<string | null>(null);

  useEffect(() => {
    if (isFiltered) setSelecteWord(null);
  }, [isFiltered]);

  const handleClickWord = (word: string) => {
    onWordClick(word);
    setSelecteWord((prev) => (prev === word ? null : word));
  };

  return (
    <div className="word-cloud">
      <WordCloud
        words={words}
        onWordClick={(word) => handleClickWord(word)}
        selectWord={selecteWord}
        isFiltered={isFiltered}
      />
    </div>
  );
};

export default CosmeticWordCloud;
