package com.cocoa.backend.domain.review.mapper;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.mapper.CosmeticMapper;
import com.cocoa.backend.domain.review.dto.ReviewDTO;
import com.cocoa.backend.domain.review.entity.Review;
import com.cocoa.backend.domain.user.dto.response.UserDTO;
import com.cocoa.backend.global.redis.RedisService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReviewMapper {
	private final RedisService redisService;
	private final CosmeticMapper cosmeticMapper;

	private List<String> getImageUrls(Review review){
		return Stream.of(
				review.getImageUrl1(),
				review.getImageUrl2(),
				review.getImageUrl3(),
				review.getImageUrl4(),
				review.getImageUrl5()
			).filter(img -> img != null && !img.isBlank())
			.toList();
	}

	public ReviewDTO toDTO(Review review){
		return toDTO(review,false);
	}

	public ReviewDTO toDTO(Review review, boolean helpfulForMe) {
		return toDTO(review,getImageUrls(review),helpfulForMe);
	}

	private ReviewDTO toDTO(Review review, List<String> imageUrls, boolean helpful) {

		UserDTO userDTO = UserDTO.fromEntity(review.getUser());
		CosmeticResponseDTO cosmeticResponseDTO = cosmeticMapper.CosmeticDTOFromEntity(review.getCosmetic(),userDTO.getId());
		ReviewDTO dto = new ReviewDTO(review.getReviewId(), userDTO, cosmeticResponseDTO, review.getContent(), review.getSatisfied(),imageUrls,
			review.getHelpfulCount(), helpful, review.getCreatedAt());
		return dto;
	}
}
