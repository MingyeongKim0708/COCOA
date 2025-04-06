package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CategoryResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.cosmetic.entity.CosmeticKeywords;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticRepository;
import com.cocoa.backend.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class CosmeticServiceImpl implements CosmeticService {

    private final CosmeticRepository cosmeticRepository;
    private final RedisService redisService;

    @Override
    public List<CosmeticResponseDTO> getCosmeticsByCategoryId(Integer categoryId, Long userId) {
        List<Cosmetic> cosmetics = cosmeticRepository.findByCategory_CategoryId(categoryId);

        return cosmetics.stream()
                .map(c -> {
                    // 1. 키워드 처리
                    CosmeticKeywords cosmeticKeywords = c.getCosmeticKeywords();

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
                    boolean isLiked = redisService.isLikedCosmetic(userId, c.getCosmeticId().longValue());
                    long likeCount = redisService.getLikeCountOfCosmetic(c.getCosmeticId().longValue());

                    // 3. 이미지 리스트 (null-safe)
                    List<String> images = Stream.of(c.getImageUrl1(), c.getImageUrl2(), c.getImageUrl3())
                            .filter(img -> img != null && !img.isBlank())
                            .toList();

                    // 4. 카테고리 DTO 생성
                    CategoryResponseDTO categoryDTO = new CategoryResponseDTO(
                            c.getCategory().getCategoryId(),
                            c.getCategory().getMajorCategory(),
                            c.getCategory().getMiddleCategory(),
                            c.getCategory().getCategoryNo()
                    );

                    // 5. 리뷰 수 (미구현 상태, 0으로 세팅)
                    int reviewCount = 0;

                    // 6. 성분 리스트 (미구현 상태)
                    List<String> ingredient = Collections.emptyList();

                    return new CosmeticResponseDTO(
                            c.getCosmeticId(),
                            c.getName(),
                            c.getBrand(),
                            c.getOptionName(),
                            images,
                            keywordsMap,
                            top3Keywords,
                            isLiked,
                            likeCount,
                            reviewCount,
                            categoryDTO,
                            ingredient
                    );
                })
                .toList();
    }


}
