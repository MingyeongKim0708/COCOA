import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";

interface CardProps {
  imageUrl: string;
  onRemove: () => void;
}

// ✅ 환경 변수에서 default 이미지 경로 가져오기
const DEFAULT_IMAGE_URL = `${process.env.NEXT_PUBLIC_S3_URL}/profile-image/default_profile.png`;

const Card: React.FC<CardProps> = ({ imageUrl, onRemove }) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  return (
    <div className="relative mr-3 h-32 w-24 flex-shrink-0">
      <img
        src={imgSrc}
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
