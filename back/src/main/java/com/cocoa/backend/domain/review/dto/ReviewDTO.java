package com.cocoa.backend.domain.review.dto;

import java.time.LocalDate;
import java.util.List;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.service.CosmeticService;
import com.cocoa.backend.domain.review.entity.Review;
import com.cocoa.backend.domain.user.dto.response.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ReviewDTO {
	private Long reviewId;
	private UserDTO user;
	private CosmeticResponseDTO cosmetic;
	private String content;
	private Boolean satisfied;
	private List<String> imageUrls;
	private int helpfulCount;
	private boolean helpfulForMe;
	private LocalDate createdAt;
}
