import { useRouter } from "next/navigation";
import ProductActionBar from "./ProductActionBar";
import ProductTags from "./ProductTags";
import type { Cosmetic } from "@/types/cosmetic";

interface ProductCardProps {
  cosmetic: Cosmetic;
}

const ProductCard = ({ cosmetic }: ProductCardProps) => {
  const router = useRouter();
  const goToDetail = () => {
    router.push(`/cosmetic/${cosmetic.cosmeticId}`);
  };
  // console.log("화장품 정보 : ", cosmetic);
  return (
    <div className="w-full max-w-[160px] bg-white pb-4" role="button">
      <div onClick={goToDetail}>
        <img
          src={cosmetic.images[0]}
          alt={cosmetic.name}
          className="mx-auto h-[160px] w-[160px] rounded-xl object-cover"
        />

        <div className="mt-2">
          <h3 className="line-clamp-1 text-size4 font-title text-gray1">
            {cosmetic.brand}
          </h3>
          {cosmetic.optionName === "page" ? (
            <p className="mt-1 line-clamp-3 min-h-[3.9rem] whitespace-pre-line text-size4 font-body text-gray1">
              {cosmetic.name}
            </p>
          ) : (
            <>
              <p className="line-clamp-1 text-size4 text-pink1">
                {cosmetic.optionName}
              </p>
              <p className="mt-1 line-clamp-2 whitespace-pre-line text-size4 font-body text-gray1">
                {cosmetic.name}
              </p>
            </>
          )}

          {/* <p className="mt-1 line-clamp-3 min-h-[3.9rem] whitespace-pre-line text-size4 font-body text-gray1">
            {cosmetic.name}
          </p> */}
        </div>

        <div className="mt-2">
          <ProductTags tags={cosmetic.topKeywords} />
        </div>
      </div>

      <div className="mt-2">
        <ProductActionBar
          productId={cosmetic.cosmeticId}
          likeCount={cosmetic.likeCount}
          liked={cosmetic.liked}
        />
      </div>
    </div>
  );
};

export default ProductCard;
