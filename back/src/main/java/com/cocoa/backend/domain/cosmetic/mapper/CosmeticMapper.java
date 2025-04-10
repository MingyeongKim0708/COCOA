package com.cocoa.backend.domain.cosmetic.mapper;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;

import com.cocoa.backend.domain.cosmetic.dto.response.CategoryResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.cosmetic.entity.CosmeticKeywords;
import com.cocoa.backend.global.redis.RedisService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CosmeticMapper {
	private final RedisService redisService;

	public CosmeticResponseDTO CosmeticDTOFromEntity(Cosmetic cosmetic, Long userId) {
			CosmeticKeywords cosmeticKeywords = cosmetic.getCosmeticKeywords();

			Map<String, Integer> keywordsMap = Optional.ofNullable(cosmeticKeywords)
				.map(CosmeticKeywords::getKeywords)
				.orElse(Collections.emptyMap());

			List<String> top3Keywords = Optional.ofNullable(cosmeticKeywords)
				.map(CosmeticKeywords::getTopKeywords)
				.orElse(Collections.emptyMap())
				.entrySet().stream()
				.filter(entry -> entry.getKey() != null && entry.getValue() != null)
				.sorted((a, b) -> b.getValue().compareTo(a.getValue()))
				.limit(3)
				.map(Map.Entry::getKey)
				.toList();

			// 2. Redis에서 관심 여부, 좋아요 수 가져오기
			boolean liked = redisService.isLikedCosmetic(userId, cosmetic.getCosmeticId().longValue());
			long likeCount = redisService.getLikeCountOfCosmetic(cosmetic.getCosmeticId().longValue());

			// 3. 이미지 리스트 (null-safe)
			List<String> images = Stream.of(cosmetic.getImageUrl1(), cosmetic.getImageUrl2(), cosmetic.getImageUrl3())
				.filter(img -> img != null && !img.isBlank())
				.toList();

			// 4. 카테고리 DTO 생성
			CategoryResponseDTO categoryDTO = CategoryResponseDTO.fromEntity(cosmetic.getCategory());

			// 6. 성분 리스트 (미구현 상태)
			List<String> ingredient = Collections.emptyList();

			return new CosmeticResponseDTO(
				cosmetic.getCosmeticId(),
				cosmetic.getName(),
				cosmetic.getBrand(),
				cosmetic.getOptionName(),
				images,
				keywordsMap,
				top3Keywords,
				liked,
				likeCount,
				0, //리뷰 개수 생성자에서는 0
				categoryDTO,
				ingredient
			);

	}
}
