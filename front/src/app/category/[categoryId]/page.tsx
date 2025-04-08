"use client";
import React from "react";

import ProductCard from "@/app/_components/product/ProductCard";
import PageHeader from "@/app/_components/common/PageHeader";
import ScrollToTopButton from "@/app/_components/common/ScrollToTopButton";
import { dummyProducts } from "@/mocks/dummyProducts";
import T3 from "@/app/_components/common/T3";

export default function CategoryPage() {
  return (
    <>
      <PageHeader title="스킨케어 / 스킨/토너" showBackButton />
      <div className="flex flex-row justify-between p-2">
        <div className="flex flex-row">
          <T3 children="멜롱이" className="text-red2" />
          <T3 children="님에게 맞는 제품" />
        </div>
        <img src="/images/toggle.svg" alt="토글 임시" />
      </div>
      <div className="grid grid-cols-2 place-items-center gap-2">
        {dummyProducts.map((product) => (
          <ProductCard cosmetic={product} key={product.id} />
        ))}
      </div>
      <ScrollToTopButton />
    </>
  );
}
