package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.cosmetic.mapper.CosmeticMapper;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticRepository;
import com.cocoa.backend.domain.review.service.ReviewService;
import com.cocoa.backend.global.exception.CustomException;
import com.cocoa.backend.global.exception.InterestErrorCode;
import com.cocoa.backend.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CosmeticServiceImpl implements CosmeticService {

    private final CosmeticRepository cosmeticRepository;
    private final CosmeticMapper cosmeticMapper;
    private final RedisService redisService;

    @Override
    public Cosmetic getOneByCosmeticId(Integer cosmeticId) {
        return cosmeticRepository.getReferenceById(cosmeticId);
    }

    @Override
    public List<CosmeticResponseDTO> getCosmeticsByCategoryId(Integer categoryId, Long userId) {
        long start = System.currentTimeMillis();
        List<Cosmetic> cosmetics = cosmeticRepository.findByCategory_CategoryId(categoryId);
        long end = System.currentTimeMillis();
        log.info("전체 조회 API 응답 시간: {} ms", (end - start));
        
        return cosmetics.stream()
                .map(c -> {
                    return cosmeticMapper.CosmeticDTOFromEntity(c, userId);
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
                    return cosmeticMapper.CosmeticDTOFromEntity(c, userId);
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

    @Override
    public List<CosmeticResponseDTO> getCosmeticsByCursor(Integer categoryId, Integer lastId, int size, Long userId) {
        Pageable pageable = PageRequest.of(0, size, Sort.by("cosmeticId").ascending());

        List<Cosmetic> cosmetics = cosmeticRepository.findCosmeticsByCursor(categoryId, lastId, pageable);

        return cosmetics.stream()
                .map(c -> {
                    Map<String, Integer> keywordsMap = Optional.ofNullable(c.getCosmeticKeywords())
                            .map(k -> k.getTopKeywords())
                            .orElse(Collections.emptyMap());

                    List<String> top3Keywords = keywordsMap.entrySet().stream()
                            .filter(e -> e.getKey() != null && e.getValue() != null)
                            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                            .limit(3)
                            .map(Map.Entry::getKey)
                            .toList();

                    List<String> images = Stream.of(c.getImageUrl1(), c.getImageUrl2(), c.getImageUrl3())
                            .filter(img -> img != null && !img.isBlank())
                            .toList();

                    boolean liked = redisService.isLikedCosmetic(userId, c.getCosmeticId().longValue());
                    long likeCount = redisService.getLikeCountOfCosmetic(c.getCosmeticId().longValue());

                    CategoryResponseDTO categoryDTO = new CategoryResponseDTO(
                            c.getCategory().getCategoryId(),
                            c.getCategory().getMajorCategory(),
                            c.getCategory().getMiddleCategory(),
                            c.getCategory().getCategoryNo()
                    );

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
                })
                .toList();
    }

}
