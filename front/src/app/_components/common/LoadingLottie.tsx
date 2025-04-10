"use client";

import Lottie from "lottie-react";
import { useRef, useEffect } from "react";
import loadingAnimation from "../../../../public/lottie/melong.json";

export default function LoadingLottie() {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(3);
    }
  }, []);

  return (
    <div className="flex h-screen -translate-y-20 items-center justify-center">
      <Lottie
        lottieRef={lottieRef}
        animationData={loadingAnimation}
        loop
        autoplay
        className="h-80 w-80"
      />
    </div>
  );
}
