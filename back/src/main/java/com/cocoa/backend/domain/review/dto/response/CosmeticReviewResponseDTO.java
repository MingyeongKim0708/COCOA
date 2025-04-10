package com.cocoa.backend.domain.review.dto.response;

import java.util.List;

import com.cocoa.backend.domain.review.dto.ReviewDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CosmeticReviewResponseDTO {
	int reviewAmount;
	List<ReviewDTO> reviews;
}
