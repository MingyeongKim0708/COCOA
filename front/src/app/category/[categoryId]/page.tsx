"use client";
import React from "react";

import ProductCard from "@/app/_components/product/ProductCard";
import PageHeader from "@/app/_components/common/PageHeader";
import ScrollToTopButton from "@/app/_components/common/ScrollToTopButton";
import { dummyProducts } from "@/mocks/dummyProducts";

export default function CategoryPage() {
  return (
    <>
      <PageHeader title="스킨케어 / 스킨/토너" showBackButton />
      <div className="grid grid-cols-2 place-items-center gap-2">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <ScrollToTopButton />
    </>
  );
}
