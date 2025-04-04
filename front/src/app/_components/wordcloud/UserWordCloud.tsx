import React from "react";
import WordCloud from "./WordCloud";

interface UserWordCloudProps {
  words: Record<string, number>;
}

const UserWordCloud = ({ words }: UserWordCloudProps) => {
  return (
    <div className="relative h-fit w-fit">
      <img
        src="/images/word-cloud-border.svg"
        alt="워드클라우드 테두리"
        className="w-full"
      />
      <div className="absolute left-1/2 top-1/2 flex h-[7.5rem] w-[17.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <WordCloud words={words} width={14.375} height={5} />
      </div>
    </div>
  );
};

export default UserWordCloud;
