"use client";
import React from "react";
import Card from "./_component/Card";

export default function MainPage() {
  return (
    <div>
      메인 페이지입니다.
      <div className="gap-4 flex flex-row ">
        <Card className={"bg-gray-500 id"} number={4} />
        <Card number={2} />
        <Card number={3} />
      </div>
    </div>
  );
}
