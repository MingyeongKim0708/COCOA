"use client";

import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    const container = document.querySelector(".app-container");
    container?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={
        "fixed bottom-[4.5rem] right-4 z-50 rounded-full bg-pink2 p-2 text-white shadow-md"
      }
      aria-label="스크롤 최상단으로 이동"
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;
