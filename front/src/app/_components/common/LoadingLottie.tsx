"use client";

import Lottie from "lottie-react";
import { useRef, useEffect, useState } from "react";

export default function LoadingLottie() {
  const lottieRef = useRef<any>(null);
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    const fetchLottie = async () => {
      const res = await fetch("/lottie/melong.json"); // ✅ public 경로 기준
      const data = await res.json();
      setAnimationData(data);
    };

    fetchLottie();
  }, []);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(3);
    }
  }, [animationData]);

  if (!animationData) return null; // 애니메이션 로딩 전

  return (
    <div className="flex h-screen -translate-y-20 items-center justify-center">
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop
        autoplay
        className="h-80 w-80"
      />
    </div>
  );
}
