import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveRecentCosmetic } from "@/stores/SearchStore";

interface CardProps {
  imageUrl: string;
  onRemove: () => void;
  id: string;
}

// ✅ 환경 변수에서 default 이미지 경로 가져오기
const DEFAULT_IMAGE_URL = `${process.env.NEXT_PUBLIC_S3_URL}/profile-image/default_profile.png`;

const Card: React.FC<CardProps> = ({ imageUrl, onRemove, id }) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const router = useRouter();
  // 이미지 클릭 시 Redis 저장
  const handleClick = () => {
    saveRecentCosmetic(Number(id), imageUrl);
    router.push(`/cosmetic/${id}`);
  };
  return (
    <div className="relative mr-3 h-32 w-24 flex-shrink-0">
      <img
        src={imgSrc}
        onClick={handleClick}
        onError={() => setImgSrc(DEFAULT_IMAGE_URL)} // 에러 발생 시 fallback 이미지
      />
      <button
        onClick={onRemove}
        className="absolute right-1 top-1 rounded-full bg-white p-1"
      >
        <X size={12} />
      </button>
    </div>
  );
};

export default Card;
