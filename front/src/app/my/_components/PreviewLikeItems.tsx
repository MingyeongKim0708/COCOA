import T3 from "@/app/_components/common/T3";
import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Cosmetic } from "@/types/cosmetic";
import { dummyProducts } from "@/mocks/dummyProducts";
import { fetchWrapper } from "@/lib/fetchWrapper";

const PreviewLikeItems = () => {
  const router = useRouter();
  const [previewLikeItems, setPreviewLikeItems] = useState<Cosmetic[] | null>();

  useEffect(() => {
    const fetchLikes = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetchWrapper(`${baseUrl}/like`, {
        credentials: "include",
      });

      if (res.ok) {
        const {
          data: { LikeItems: likes },
        } = await res.json();

        const prevLikes = likes.slice(0, 3);
        setPreviewLikeItems(prevLikes);
      }
    };

    fetchLikes();
  }, []);

  const handleGoToLikes = () => {
    router.push("/my/likes");
  };

  const handleGoToLikeProduct = (productId: number) => {
    router.push(`/product/${productId}`);
  };
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-row justify-between"
        onClick={() => handleGoToLikes()}
      >
        <T3 children="관심제품" />
        <ChevronRight size={24} />
      </div>
      <div className="flex flex-row justify-start gap-3 overflow-hidden">
        {previewLikeItems &&
          previewLikeItems.map((cosmetic, idx) => {
            return (
              <div
                key={idx}
                className="aspect-square w-[30vw] min-w-[6.375rem] cursor-pointer"
                onClick={() => handleGoToLikeProduct(cosmetic.cosmeticId)}
              >
                <img
                  src={cosmetic.images[0]}
                  alt="profile image"
                  className="h-full w-full flex-shrink-0 rounded-lg object-cover"
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PreviewLikeItems;
