import { useRouter } from "next/navigation";
import ProductActionBar from "./ProductActionBar";
import ProductTags from "./ProductTags";
import type { Cosmetic } from "@/types/cosmetic";

type ProductCardProps = Pick<
  Cosmetic,
  "id" | "name" | "brand" | "images" | "keywords" | "isLiked" | "likeCount"
>;

const ProductCard = ({
  id,
  name,
  brand,
  images,
  keywords,
  isLiked,
  likeCount,
}: ProductCardProps) => {
  const router = useRouter();
  const goToDetail = () => {
    router.push(`/product/${id}`);
  };

  return (
    <div
      className="w-full max-w-[160px] bg-white pb-4"
      onClick={goToDetail}
      role="button"
    >
      <img
        src={images[0]}
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
          <ProductTags tags={keywords.map((kw) => Object.keys(kw)[0])} />
        </div>

        <div className="mt-2">
          <ProductActionBar likeCount={likeCount} isLiked={isLiked} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
