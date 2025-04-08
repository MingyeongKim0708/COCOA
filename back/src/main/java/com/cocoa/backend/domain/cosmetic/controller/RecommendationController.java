package com.cocoa.backend.domain.cosmetic.controller;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.service.RecommendationService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    // 사용자 리뷰 기반 맞춤 추천 API
    @GetMapping("/category/{categoryId}/custom")
    public List<CosmeticResponseDTO> getCustomRecommendations(
            @PathVariable Integer categoryId,
            @AuthenticationPrincipal CustomOAuth2UserDTO userDetails
    ) {
        return recommendationService.getRecommendedCosmetics(categoryId, userDetails.getUserId());
    }
}
