package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CategoryResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.cosmetic.entity.CosmeticKeywords;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticRepository;
import com.cocoa.backend.global.exception.CustomException;
import com.cocoa.backend.global.exception.InterestErrorCode;
import com.cocoa.backend.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
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
        long start = System.currentTimeMillis();
        long end = System.currentTimeMillis();
        log.info("전체 조회 API 응답 시간: {} ms", (end - start));
        
        return cosmetics.stream()
                .map(c -> {
                    // 1. 키워드 처리
                    CosmeticKeywords cosmeticKeywords = c.getCosmeticKeywords();

                    Map<String, Integer> keywordsMap = Optional.ofNullable(cosmeticKeywords)
                            .map(CosmeticKeywords::getTopKeywords)
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
                    boolean liked = redisService.isLikedCosmetic(userId, c.getCosmeticId().longValue());
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
                            liked,
                            likeCount,
                            reviewCount,
                            categoryDTO,
                            ingredient
                    );
                })
                .toList();
    }

    @Override
    public List<CosmeticResponseDTO> getInterestedCosmetics(Long userId) {
        Set<String> cosmeticIdStrings = redisService.getInterestedCosmeticIds(userId);
        if (cosmeticIdStrings == null || cosmeticIdStrings.isEmpty()) return List.of();

        List<Integer> cosmeticIds = cosmeticIdStrings.stream()
                .map(Integer::parseInt)
                .toList();

        List<Cosmetic> cosmetics = cosmeticRepository.findAllById(cosmeticIds);

        return cosmetics.stream()
                .map(c -> {
                    // 이전 getCosmeticsByCategoryId 내부의 DTO 가공 로직 재사용
                    Map<String, Integer> keywordsMap = Optional.ofNullable(c.getCosmeticKeywords())
                            .map(CosmeticKeywords::getTopKeywords)
                            .orElse(Collections.emptyMap());

                    List<String> top3Keywords = Optional.ofNullable(c.getCosmeticKeywords())
                            .map(CosmeticKeywords::getTopKeywords)
                            .orElse(Collections.emptyMap())
                            .entrySet().stream()
                            .filter(e -> e.getKey() != null && e.getValue() != null)
                            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                            .limit(3)
                            .map(Map.Entry::getKey)
                            .toList();

                    List<String> images = Stream.of(
                                    c.getImageUrl1(),
                                    c.getImageUrl2(),
                                    c.getImageUrl3()
                            ).filter(img -> img != null && !img.isBlank())
                            .toList();

                    CategoryResponseDTO categoryDTO = new CategoryResponseDTO(
                            c.getCategory().getCategoryId(),
                            c.getCategory().getMajorCategory(),
                            c.getCategory().getMiddleCategory(),
                            c.getCategory().getCategoryNo()
                    );

                    boolean liked = true; // 이미 관심 등록된 제품이니까 true
                    long likeCount = redisService.getLikeCountOfCosmetic(c.getCosmeticId().longValue());

                    return new CosmeticResponseDTO(
                            c.getCosmeticId(),
                            c.getName(),
                            c.getBrand(),
                            c.getOptionName(),
                            images,
                            keywordsMap,
                            top3Keywords,
                            liked,
                            likeCount,
                            0,
                            categoryDTO,
                            Collections.emptyList()
                    );
                }).toList();
    }

    @Override
    public void addInterest(Long userId, Long cosmeticId) {
        if (redisService.isLikedCosmetic(userId, cosmeticId)) {
            throw new CustomException(InterestErrorCode.ALREADY_INTERESTED);
        }
        redisService.addInterestProduct(userId, cosmeticId);
    }

    @Override
    public void removeInterest(Long userId, Long cosmeticId) {
        if (!redisService.isLikedCosmetic(userId, cosmeticId)) {
            throw new CustomException(InterestErrorCode.INTEREST_NOT_FOUND);
        }
        redisService.removeInterestProduct(userId, cosmeticId);
    }

}
