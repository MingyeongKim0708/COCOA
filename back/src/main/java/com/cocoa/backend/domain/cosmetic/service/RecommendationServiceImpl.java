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


import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
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
        long start = System.currentTimeMillis();

        Optional<UserKeywords> userKeywordsOpt = userKeywordsRepository.findById(userId);
        Map<String, Integer> userTopKeywords = userKeywordsOpt
                .map(UserKeywords::getTopKeywords)
                .orElse(Collections.emptyMap());

        String newKeywordHash = computeKeywordHash(userTopKeywords);

        // 캐시된 해시와 비교
        String cachedHash = redisService.getRecommendationKeywordHash(userId, categoryId);
        if (Objects.equals(cachedHash, newKeywordHash)) {
            List<CosmeticResponseDTO> cached = redisService.getCachedRecommendation(userId, categoryId);
            if (cached != null) {
                // 관심 상태 최신값으로 업데이트
                for (CosmeticResponseDTO dto : cached) {
                    Long cosmeticId = dto.getCosmeticId().longValue();

                    dto.setLiked(redisService.isLikedCosmetic(userId, cosmeticId));
                    dto.setLikeCount(redisService.getLikeCountOfCosmetic(cosmeticId));
                }

                log.info("Redis 캐시에서 추천 결과 반환 (관심 상태 보정 완료)");
                return cached;
            }
        } else {
            // 해시 불일치 시 기존 캐시 삭제
            redisService.deleteCachedRecommendation(userId, categoryId);
            redisService.deleteRecommendationStatus(userId, categoryId);
            log.info("캐시 무효화: 사용자 키워드 변경 감지 (기존: {}, 새로: {})", cachedHash, newKeywordHash);
        }

        // 1. Redis 캐시 확인
//        List<CosmeticResponseDTO> cached = redisService.getCachedRecommendation(userId, categoryId);
//        if (cached != null) {
//            log.info("Redis 캐시에서 추천 결과 반환");
//            return cached;
//        }

        // 2. 추천 상태 확인
        String status = redisService.getRecommendationStatus(userId, categoryId);
        if ("processing".equals(status)) {
            log.info("추천 진행 중 → 프론트에서 '추천 중입니다' 메시지를 표시해야 함");
            return null; // 빈 추천인지 추천 중인지 구분하기 위해 null 반환
        }

        // 3. 상태 저장: processing
        redisService.setRecommendationStatus(userId, categoryId, "processing");
        log.info("상태 저장 → 유저 {}의 카테고리 {} 상태 processing", userId, categoryId);

        try {
            // 4. 사용자 top 키워드 조회
            // DB 자체에 UserKeywords 레코드가 없는 경우
            if (userKeywordsOpt.isEmpty()) {
                log.info("유저 {}의 키워드가 없음 → 추천 없음 반환", userId);
                // 캐시에 결과 저장 및 상태 변경
                redisService.setRecommendationStatus(userId, categoryId, "ready");
                redisService.cacheRecommendation(userId, categoryId, List.of());
                return List.of(); // 유저 키워드가 아예 존재하지 않음
            }

            // UserKeywords 레코드는 있지만 값이 없는 경우
            if (userTopKeywords == null || userTopKeywords.isEmpty()) {
                log.info("유저 {}의 키워드가 비어 있음 → 추천 없음 반환", userId);
                // 캐시에 결과 저장 및 상태 변경
                redisService.setRecommendationStatus(userId, categoryId, "ready");
                redisService.cacheRecommendation(userId, categoryId, List.of());
                return List.of(); // 키워드가 비어 있어도 추천 불가
            }

            // 5. 해당 카테고리의 모든 제품 top 키워드 조회
            List<Cosmetic> cosmetics = cosmeticRepository.findByCategory_CategoryId(categoryId);

            // 6. cosine similarity 계산 및 정렬
            List<Pair<Cosmetic, Double>> scored = cosmetics.stream()
                    .map(cosmetic -> {
                        Map<String, Integer> productTopKeywords = Optional.ofNullable(cosmetic.getCosmeticKeywords())
                                .map(CosmeticKeywords::getTopKeywords)
                                .orElse(Collections.emptyMap());

                        double similarity = calculateCosineSimilarity(userTopKeywords, productTopKeywords);

                        // 유사도 궁금하면 이거 주석 풀어서 확인하세요
//                    log.info("cosmeticId: {}, name: {}, similarity: {}",
//                            cosmetic.getCosmeticId(),
//                            cosmetic.getName(),
//                            similarity);

                        return Pair.of(cosmetic, similarity); // 또는 Map.Entry로 해도 됨
                    })
                    .sorted((a, b) -> Double.compare(b.getRight(), a.getRight()))  // 유사도 높은 순
                    .limit(10)
                    .toList();

            // 7. DTO 변환
            List<CosmeticResponseDTO> result = scored.stream()
                    .map(pair -> {
                        Cosmetic c = pair.getLeft();
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


            // 8. 캐시에 저장할 DTO에서 liked, likeCount 초기화
            List<CosmeticResponseDTO> rawResult = result.stream()
                    .map(dto -> {
                        dto.setLiked(false);
                        dto.setLikeCount(0);
                        return dto;
                    }).toList();

            redisService.cacheRecommendation(userId, categoryId, result);
            redisService.setRecommendationStatus(userId, categoryId, "ready");
            redisService.setRecommendationKeywordHash(userId, categoryId, newKeywordHash); // ✅ 성공한 경우에만 저장


            long end = System.currentTimeMillis();
            log.info("추천 API 처리 시간: {} ms", (end - start));

            return result;
        } catch (Exception e){
            redisService.setRecommendationStatus(userId, categoryId, "fail");
            log.error("추천 API 처리 중 예외 발생", e);
            return List.of();
        }
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

    private String computeKeywordHash(Map<String, Integer> keywords) {
        try {
            String combined = keywords.entrySet().stream()
                    .sorted(Map.Entry.comparingByKey())
                    .map(e -> e.getKey() + ":" + e.getValue())
                    .reduce((a, b) -> a + "," + b)
                    .orElse("");
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(combined.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (Exception e) {
            throw new RuntimeException("키워드 해시 계산 실패", e);
        }
    }

}
