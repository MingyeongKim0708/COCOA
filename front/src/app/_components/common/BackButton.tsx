"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className={className}>
      <ChevronLeft size={25} className="text-gray1" />
    </button>
  );
};

export default BackButton;
