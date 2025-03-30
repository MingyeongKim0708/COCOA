"use client";
import React from "react";
import BottomNav from "../_components/common/BottomNav";

export default function MainPage() {
  return (
    <div className="text-pink1">
      <div>메인 페이지입니다.</div>
      <a href="/" className="text-size2 text-brown1">
        root로 이동
      </a>

      <BottomNav />
      <hr />
      <h1 className="text-head0 font-head">head0 스타일</h1>
      <h1 className="text-head1 font-head text-red1">head1 스타일</h1>
      <h2 className="text-head2 font-head text-red2">head2 스타일</h2>
      <div className="text-size1 font-title">title1 스타일</div>
      <div className="text-size2 font-title text-pink1">title2 스타일</div>
      <div className="text-size3 font-title text-pink2">title3 스타일</div>
      <div className="text-size4 font-title text-pink3">title4 스타일</div>
      <div className="text-size5 font-title text-pink4">title5 스타일</div>
      <div className="text-size6 font-title text-gray2">title6 스타일</div>
      <div className="text-size1 font-body">body1 스타일</div>
      <div className="text-size2 font-body text-pink1">body2 스타일</div>
      <div className="text-size3 font-body text-pink2">body3 스타일</div>
      <div className="text-size4 font-body text-pink3">body4 스타일</div>
      <div className="text-size5 font-body text-pink4">body5 스타일</div>
      <div className="text-size6 font-body text-gray2">body6 스타일</div>
    </div>
  );
}
