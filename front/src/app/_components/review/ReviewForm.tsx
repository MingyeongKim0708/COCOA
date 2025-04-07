"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/_components/common/PageHeader";
import T3 from "@/app/_components/common/T3";
import T4 from "@/app/_components/common/T4";
import ReviewProductInfo from "@/app/_components/review/ReviewProductInfo";
import ReviewImageGrid from "@/app/_components/review/ReviewImageGrid";
import Button from "@/app/_components/common/Button";
import { Review } from "@/types/review";
import { Cosmetic } from "@/types/cosmetic";
import { InfoIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import Modal from "../common/Modal";

interface ReviewFormProps {
  cosmetic: Cosmetic;
  initialReview?: Review;
  onSubmit: (form: {
    reviewId?: number;
    cosmeticId: number;
    satisfied: boolean;
    content: string;
    images: File[];
  }) => void;
}

export default function ReviewForm({
  cosmetic,
  initialReview,
  onSubmit,
}: ReviewFormProps) {
  const [satisfied, setSatisfied] = useState<true | false | null>(
    initialReview?.satisfied ?? null,
  );
  const [content, setContent] = useState<string>(initialReview?.content ?? "");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const combined = [...imageFiles, ...newFiles].slice(0, 5);
    setImageFiles(combined);
  };

  const handleRemoveImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (satisfied === null || !content) {
      alert("리뷰 내용과 만족도를 모두 입력해주세요.");
      return;
    }

    const cosmeticId = cosmetic.id;

    if (initialReview) {
      const reviewId = initialReview.reviewId;
      onSubmit({
        reviewId,
        cosmeticId,
        satisfied,
        content,
        images: imageFiles,
      });
    } else {
      onSubmit({
        cosmeticId,
        satisfied,
        content,
        images: imageFiles,
      });
    }
  };

  const reviewGuideBody = (
    <div className="flex flex-col gap-4 text-sm">
      <p>
        <b>
          당신의 경험을 더 자세히 알려주신다면 좀 더 정확한 맞춤 추천이
          <br />
          가능해요.
        </b>
      </p>
      <div>
        <p>화장품에 대한 자극 반응</p>
        <p>
          ex) <b>자극이 없고 순해서 좋아요.</b>
        </p>
      </div>
      <div>
        <p>화장품을 사용한 목적</p>
        <p>
          ex) <b>트러블 관리에 좋았어요.</b>
        </p>
      </div>
      <div>
        <p>화장품을 사용했을 때 좋았던 점</p>
        <p>
          ex) <b>건조할 때 사용하기 좋았어요.</b>
        </p>
        <p className="pl-[1.4rem]">
          <b>대용량인데 저렴해서 가성비가 좋아요.</b>
        </p>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        title={initialReview ? "리뷰 수정" : "리뷰 작성"}
        showBackButton
      />
      {isModalOpen && (
        <>
          <Modal
            header="리뷰 작성 가이드"
            body={reviewGuideBody}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
      <div className="flex flex-col gap-3 py-2">
        <ReviewProductInfo cosmetic={cosmetic} />

        {/* 만족도 */}
        <div className="flex flex-col items-center text-center">
          <T4 children="해당 상품 사용 경험이 긍정적이셨나요?" />
          <div className="mt-2 flex gap-6">
            <button onClick={() => setSatisfied(true)} className="p-2">
              <ThumbsUp
                className={`${satisfied === true ? "text-pink1" : "text-gray3"} w-20`}
              />
            </button>
            <button onClick={() => setSatisfied(false)} className="p-2">
              <ThumbsDown
                className={`${satisfied === false ? "text-pink1" : "text-gray3"} w-20`}
              />
            </button>
          </div>
        </div>

        <hr />

        {/* 리뷰 내용 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <T3 children="리뷰 쓰기" />
            <button onClick={() => setIsModalOpen(true)}>
              <InfoIcon className="text-pink2" />
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="제품 사용 후기를 자유롭게 작성해 주세요."
            className="min-h-36 w-full resize-none rounded-lg border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-pink1"
          />
        </div>

        {/* 이미지 */}
        <div>
          <T3>사진 업로드</T3>
          <ReviewImageGrid
            files={imageFiles}
            onAdd={handleAddImage}
            onRemove={handleRemoveImage}
            editable
          />
        </div>

        <div className="px-3">
          <Button onClick={handleSubmit}>
            {initialReview ? "리뷰 수정하기" : "리뷰 등록하기"}
          </Button>
        </div>
      </div>
    </>
  );
}
