package com.cocoa.backend.domain.review.service;

import java.util.List;

import com.cocoa.backend.domain.review.dto.ReviewDTO;
import com.cocoa.backend.domain.review.dto.request.ReviewInsertRequestDTO;
import com.cocoa.backend.domain.review.dto.request.ReviewUpdateRequestDTO;
import com.cocoa.backend.domain.review.dto.response.CosmeticReviewResponseDTO;
import com.cocoa.backend.domain.review.dto.response.UserReviewResponseDTO;

public interface ReviewService {
	boolean insertReview(long userId, ReviewInsertRequestDTO request);

	boolean updateReview(long userId, ReviewUpdateRequestDTO request);

	boolean increaseHelpfulCount(Long userId, long reviewId);

	boolean decreaseHelpfulCount(Long userId, long reviewId);

	CosmeticReviewResponseDTO getReviewsByCosmeticId(long userId, int cosmeticId, String  keyword, int page);

	UserReviewResponseDTO getReviewsByUserId(long userId, boolean isOwner, int page);

	int getReviewAmount(int cosmeticId);

	ReviewDTO getUpdateReview(long reviewId);
}
