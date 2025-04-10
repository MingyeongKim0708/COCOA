package com.cocoa.backend.domain.review.dto.request;

import java.util.Map;

import lombok.Getter;

@Getter
public class ReviewKeywordResponseDTO {
	int reviewId;
	Map<String, Integer> keywords;
}
