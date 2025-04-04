import Tag from "../common/Tag";
import B4 from "../common/B4";
import T5 from "../common/T5";
import { Cosmetic } from "@/types/cosmetic";

interface ReviewProductInfoProps {
  cosmetic: Cosmetic | null;
}

const ReviewProductInfo = ({ cosmetic }: ReviewProductInfoProps) => {
  if (cosmetic == null) return;
  return (
    <div className="flex gap-3">
      <img
        src={cosmetic.images[0]}
        alt="profile image"
        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
      />
      <div className="flex flex-col justify-between">
        <T5 children={cosmetic.brand} />
        <B4
          children={cosmetic.name}
          className="line-clamp-2 text-ellipsis break-words"
        />
        <div className="no-scrollbar flex flex-row gap-x-3 overflow-x-auto">
          {Object.keys(cosmetic.keywords)
            .slice(0, 3)
            .map((key) => (
              <Tag children={key} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewProductInfo;
