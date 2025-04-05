import React from "react";
import WordCloud from "./WordCloud";
import T4 from "../common/T4";

interface UserWordCloudProps {
  words: Record<string, number> | null;
}

const UserWordCloud = ({ words }: UserWordCloudProps) => {
  return (
    <div className="relative h-fit w-fit">
      <img
        src="/images/word-cloud-border.svg"
        alt="워드클라우드 테두리"
        className="w-full"
      />
      {words ? (
        <div className="absolute left-1/2 top-1/2 flex h-[7.5rem] w-[17.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <WordCloud words={words} width={14.375} height={5} />
        </div>
      ) : (
        <div className="absolute left-1/2 top-1/2 flex h-[7.5rem] w-[17.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <T4
            children="리뷰를 작성하면...어떤 일이 생길까?"
            className="text-gray2"
          />
        </div>
      )}
    </div>
  );
};

export default UserWordCloud;
