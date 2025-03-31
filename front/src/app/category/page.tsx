"use client";
import React from "react";
import PageHeader from "../_components/common/PageHeader";
import { useRouter } from "next/navigation";
import Input from "../_components/common/Input";

export default function MainPage() {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/category/${id}`);
  };
  return (
    <div>
      <PageHeader title="카테고리" />
      <div className="text-head0 font-title text-pink1">
        카테고리 페이지입니다.
      </div>
      <a href="/" className="text-size2 text-brown1">
        Landing으로 이동
      </a>
      <br />
      <a href="category/custom" className="text-size2 text-brown1">
        맞춤 카테고리로 이동
      </a>
      <br />
      <button onClick={() => handleClick(1)}>카테고리1</button>
      <button onClick={() => handleClick(2)}>카테고리2</button>
      <button onClick={() => handleClick(3)}>카테고리3</button>
      <label className="mb-1 block text-size4 font-title text-brown1">
        닉네임을 입력해주세요
      </label>
      <Input placeholder="닉네임은 12자까지 입력 가능합니다." />
      <div className="text-head0">스크롤 테스트용1</div>
      <div className="text-head0">스크롤 테스트용2</div>
      <div className="text-head0">스크롤 테스트용3</div>
      <div className="text-head0">스크롤 테스트용4</div>
      <div className="text-head0">스크롤 테스트용5</div>
      <div className="text-head0">스크롤 테스트용6</div>
      <div className="text-head0">스크롤 테스트용7</div>
      <div className="text-head0">스크롤 테스트용8</div>
      <div className="text-head0">스크롤 테스트용9</div>
      <div className="text-head0">스크롤 테스트용10</div>
      <div className="text-head0">스크롤 테스112 111111das</div>
    </div>
  );
}
