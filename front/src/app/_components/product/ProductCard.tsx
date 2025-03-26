import ProductActionBar from "./ProductActionBar";
import ProductTags from "./ProductTags";

interface ProductCardProps {
  imageUrl: string;
  brand: string;
  name: string;
  tags: string[];
  likeCount: number;
  isLiked: boolean;
}

const ProductCard = ({
  imageUrl,
  brand,
  name,
  tags,
  likeCount,
  isLiked,
}: ProductCardProps) => {
  return (
    <div className="w-full max-w-[160px] bg-white pb-4">
      <img
        src={imageUrl}
        alt={name}
        className="mx-auto h-[160px] w-[160px] rounded-xl object-cover"
      />

      <div className="mt-2">
        <h3 className="line-clamp-1 text-size4 font-title text-gray1">
          {brand}
        </h3>
        <p className="mt-1 line-clamp-3 min-h-[3.9rem] whitespace-pre-line text-size4 font-body text-gray1">
          {name}
        </p>

        <div className="mt-2">
          <ProductTags tags={tags} />
        </div>

        <div className="mt-2">
          <ProductActionBar likeCount={likeCount} isLiked={isLiked} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
