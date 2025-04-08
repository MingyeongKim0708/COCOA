package com.cocoa.backend.domain.cosmetic.controller;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.service.RecommendationService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Recommendation API", description = "사용자 키워드 기반 맞춤 제품 카테고리 조회 API")
public class RecommendationController {

    private final RecommendationService recommendationService;

    // 사용자 리뷰 기반 맞춤 추천 API
    @Operation(summary = "카테고리별 맞춤 제품 전체 조회", description = "해당 카테고리에 속한 제품을 10개를 조회합니다.")
    @GetMapping("/category/{categoryId}/custom")
    public List<CosmeticResponseDTO> getCustomRecommendations(
            @PathVariable Integer categoryId,
            @AuthenticationPrincipal CustomOAuth2UserDTO userDetails
    ) {
        return recommendationService.getRecommendedCosmetics(categoryId, userDetails.getUserId());
    }
}
