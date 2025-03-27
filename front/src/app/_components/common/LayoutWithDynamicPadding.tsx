"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

import PageHeader from "./PageHeader";
import BottomNav from "./BottomNav";

// PageHeader 없음
const noHeaderRoutes = [
  "/", // Landing
  "/sign-up", // 회원가입
  "/sign-up/complete", // 회원가입 완료
  "/home", // 홈
  "/search", // 검색
  "/search/result?", //검색 결과
];

// BottomNav 없음
const noNavRoutes = [
  "/", // Landing
  "/sign-up", // 회원가입
  "/sign-up/complete", // 회원가입 완료
  "/my/withdraw", // 회원 탈퇴
  "/review/write", // 리뷰 작성
  "/review/edit", // 리뷰 수정
];

export default function LayoutWithDynamicPadding({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hasHeader = !noHeaderRoutes.includes(pathname);
  const hasNav = !noNavRoutes.includes(pathname);

  // 디버깅용
  // console.log("hasHeader? : " + hasHeader);
  // console.log("hasNav? : " + hasNav);
  // console.log("pathname:", pathname);
  // console.log(`pathname:[${pathname}]`);

  return (
    <>
      {hasHeader && <PageHeader />}
      <div
        className={cn(
          "app-container min-h-screen",
          hasHeader && "pt-header",
          hasNav && "pb-nav",
        )}
      >
        {children}
      </div>
      {hasNav && <BottomNav />}
    </>
  );
}
