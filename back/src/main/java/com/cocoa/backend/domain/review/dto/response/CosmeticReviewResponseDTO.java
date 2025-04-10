package com.cocoa.backend.domain.review.dto.response;

import java.util.List;

import com.cocoa.backend.domain.review.dto.ReviewDTO;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CosmeticReviewResponseDTO {
	int reviewAmount;
	List<ReviewDTO> reviews;
}
