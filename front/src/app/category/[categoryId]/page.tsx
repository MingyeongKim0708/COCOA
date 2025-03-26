"use client";
import React from "react";

import Footer from "@/app/_components/common/Footer";
import ProductCard from "@/app/_components/product/ProductCard";
import PageHeader from "@/app/_components/common/PageHeader";

export default function MainPage() {
  return (
    <div>
      <PageHeader title="스킨케어 / 스킨/토너" showBackButton />
      <div className="grid grid-cols-2 place-items-center gap-2">
        <ProductCard
          imageUrl="/images/A00000013216229ko.jpg"
          brand="라운드랩"
          name="[1등토너] 라운드랩 1025 독도 토너 200ml 기획 (+50ml)"
          tags={["촉촉", "윤기", "지복합성", "트러블", "가성비"]}
          isLiked={true}
          likeCount={131}
        />
        <ProductCard
          imageUrl="/images/A00000017358912ko.jpg"
          brand="넘버즈인글자길이를테스트하기위해길게작성합니다"
          name="[모공개선/탄력광채] 넘버즈인 3번 결광가득 에센스 토너 300ml 대용량 기획 글자 길이테스트를 위해 길게 작성합니다"
          tags={["태그길이용", "테스트", "옆으로스크롤"]}
          isLiked={true}
          likeCount={210}
        />
        <ProductCard
          imageUrl="/images/A00000013216229ko.jpg"
          brand="닥터지"
          name="[속보습]닥터지 더모이스처 배리어 D 리퀴드 토너 200ml 기획 (+100ml)"
          tags={["겨울", "보습", "건성"]}
          isLiked={true}
          likeCount={183}
        />
        <ProductCard
          imageUrl="/images/A00000017807504ko.jpg"
          brand="헤라"
          name="헤라 옴므 파워부스팅 토너 150ML"
          tags={["헤라", "옴므", "지복합성"]}
          isLiked={true}
          likeCount={13}
        />
        <ProductCard
          imageUrl="/images/A00000018918108ko.jpg"
          brand="브링그린"
          name="[피지쓱싹] 브링그린 티트리시카수딩토너 500mL 기획/단품"
          tags={["진정", "수부지", "브링그린", "닦토"]}
          isLiked={true}
          likeCount={809}
        />
        <ProductCard
          imageUrl="/images/A00000015861604ko.jpg"
          brand="디오디너리"
          name="디오디너리 글리코릭 애시드 7% 엑스폴리에이팅 토너 240ml"
          tags={["각질", "자극", "따가움"]}
          isLiked={true}
          likeCount={193}
        />
      </div>
      <Footer />
    </div>
  );
}
