package com.cocoa.backend.domain.cosmetic.controller;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.service.RecommendationService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.global.redis.RedisService;
import com.cocoa.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Recommendation API", description = "사용자 키워드 기반 맞춤 제품 카테고리 조회 API")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private  final RedisService redisService;

    // 사용자 리뷰 기반 맞춤 추천 API
    @Operation(summary = "카테고리별 맞춤 제품 전체 조회", description = "해당 카테고리에 속한 제품을 10개를 조회합니다.")
    @GetMapping("/category/{categoryId}/custom")
    public ResponseEntity<ApiResponse<?>> getCustomRecommendations(
            @PathVariable Integer categoryId,
            Authentication authentication
    ) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        Long userId = userDetails.getUserId();

        // 1. 추천 결과 받아오기
        List<CosmeticResponseDTO> recommended = recommendationService.getRecommendedCosmetics(categoryId, userId);

        // 2. 추천 중일 경우 프론트에 상태 정보 전달
        if (recommended == null || recommended.isEmpty()) {
            String status = redisService.getRecommendationStatus(userId, categoryId);
            if ("processing".equals(status)) {
                Map<String, Object> result = new HashMap<>();
                result.put("status", "processing");
                result.put("data", null);
                return ResponseEntity.ok(ApiResponse.success(result));
            }
        }

        // 3. 추천 결과 전달
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("status", "ready", "data", recommended)
        ));
    }
//    public List<CosmeticResponseDTO> getCustomRecommendations(
//            @PathVariable Integer categoryId,
//            Authentication authentication
//    ) {
//        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
//        return recommendationService.getRecommendedCosmetics(categoryId, userDetails.getUserId());
//    }
}
