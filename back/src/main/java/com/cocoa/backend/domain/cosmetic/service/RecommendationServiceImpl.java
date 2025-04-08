package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CategoryResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.cosmetic.entity.CosmeticKeywords;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticRepository;
import com.cocoa.backend.domain.user.entity.UserKeywords;
import com.cocoa.backend.domain.user.repository.UserKeywordsRepository;
import com.cocoa.backend.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.apache.commons.lang3.tuple.Pair;


import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final CosmeticRepository cosmeticRepository;
    private final UserKeywordsRepository userKeywordsRepository;
    private final RedisService redisService;

    @Override
    public List<CosmeticResponseDTO> getRecommendedCosmetics(Integer categoryId, Long userId) {

        // 1. 사용자 top 키워드 조회
        UserKeywords userKeywords = userKeywordsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 키워드 없음"));

        Map<String, Integer> userTopKeywords = userKeywords.getTopKeywords();
        if (userTopKeywords == null || userTopKeywords.isEmpty()) {
            return List.of(); // 추천할 키워드가 없으면 빈 리스트 반환
        }

        // 2. 해당 카테고리의 모든 제품 top 키워드 조회
        List<Cosmetic> cosmetics = cosmeticRepository.findByCategory_CategoryId(categoryId);

        List<CosmeticKeywords> cosmeticKeywordsList = cosmetics.stream()
                .map(Cosmetic::getCosmeticKeywords)
                .filter(Objects::nonNull)
                .toList();

        // 3. cosine similarity 계산 및 정렬
        List<Pair<Cosmetic, Double>> scored = cosmetics.stream()
                .map(cosmetic -> {
                    Map<String, Integer> productTopKeywords = Optional.ofNullable(cosmetic.getCosmeticKeywords())
                            .map(CosmeticKeywords::getTopKeywords)
                            .orElse(Collections.emptyMap());

                    double similarity = calculateCosineSimilarity(userTopKeywords, productTopKeywords);

                    log.info("cosmeticId: {}, name: {}, similarity: {}",
                            cosmetic.getCosmeticId(),
                            cosmetic.getName(),
                            similarity);

                    return Pair.of(cosmetic, similarity); // 또는 Map.Entry로 해도 됨
                })
                .sorted((a, b) -> Double.compare(b.getRight(), a.getRight()))  // 유사도 높은 순
                .limit(10)
                .toList();


        return scored.stream()
                .map(pair -> {
                    Cosmetic c = pair.getLeft();
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
                            0, // 리뷰 수 (아직 구현 안 됨)
                            categoryDTO,
                            Collections.emptyList() // 성분 (아직 구현 안 됨)
                    );
                })
                .toList();
    }

    // 코사인 유사도 계산
    private double calculateCosineSimilarity(Map<String, Integer> userVec, Map<String, Integer> productVec) {
        Set<String> allKeys = new HashSet<>();
        allKeys.addAll(userVec.keySet());
        allKeys.addAll(productVec.keySet());

        double dotProduct = 0.0;
        double userMagnitude = 0.0;
        double productMagnitude = 0.0;

        for (String key : allKeys) {
            int userVal = userVec.getOrDefault(key, 0);
            int productVal = productVec.getOrDefault(key, 0);

            dotProduct += userVal * productVal;
            userMagnitude += Math.pow(userVal, 2);
            productMagnitude += Math.pow(productVal, 2);
        }

        if (userMagnitude == 0.0 || productMagnitude == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(userMagnitude) * Math.sqrt(productMagnitude));
    }

}
