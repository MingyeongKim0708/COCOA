"use client";
import React from "react";
import Card from "./_component/Card";

export default function MainPage() {
  return (
    <div className="text-pink1">
      메인 페이지입니다.
      <h1 className="text-head1 font-head text-red1">head 스타일</h1>
      <h1 className="text-size1 font-title text-red">Title1 스타일</h1>
      <p className="text-size1 font-body">Body1 스타일</p>
      <p className="text-size3 font-title">Title3</p>
      <p className="text-size3 font-body">Body3</p>
      <div className="text-cocoa font-cocoa">COCOA</div>
      <span className="text-cute font-cute">귀여움</span>
      <div className="font-cocoa text-blue">cocoa 폰트</div>
      <div className="text-cocoa">COCOA 로고</div>
      <div className="flex flex-row gap-4">
        <Card className={"id bg-gray-500"} number={4} />
        <Card number={2} />
        <Card number={3} />
      </div>
    </div>
  );
}
