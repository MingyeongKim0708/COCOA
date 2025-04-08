package com.cocoa.backend.domain.cosmetic.controller;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.service.CosmeticService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.global.redis.RedisService;
import com.cocoa.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cosmetic")
@RequiredArgsConstructor
@Tag(name = "Interest API", description = "관심 제품 등록 해제 API")
public class InterestController {

    private final RedisService redisService;
    private final CosmeticService cosmeticService;

    @Operation(summary = "관심 제품 등록", description = "관심 제품으로 등록합니다.")
    @PostMapping("/{cosmeticId}/like")
    public ResponseEntity<ApiResponse<String>> addInterest(
            @PathVariable Long cosmeticId,
            Authentication authentication) {
        CustomOAuth2UserDTO user = (CustomOAuth2UserDTO) authentication.getPrincipal();
        cosmeticService.addInterest(user.getUserId(), cosmeticId);
        return ResponseEntity.ok(ApiResponse.success("관심 제품 등록 성공"));
    }

    @Operation(summary = "관심 제품 해제", description = "관심 제품을 해제합니다.")
    @DeleteMapping("/{cosmeticId}/like")
    public ResponseEntity<ApiResponse<String>> removeInterest(
            @PathVariable Long cosmeticId,
            Authentication authentication) {
        CustomOAuth2UserDTO user = (CustomOAuth2UserDTO) authentication.getPrincipal();
        cosmeticService.removeInterest(user.getUserId(), cosmeticId);
        return ResponseEntity.ok(ApiResponse.success("관심 제품 해제 성공"));
    }

    @Operation(summary = "관심 제품 목록 조회", description = "관심 제품 목록을 조회합니다.")
    @GetMapping("/likes")
    public ResponseEntity<ApiResponse<List<CosmeticResponseDTO>>> getLikedCosmetics(
            Authentication authentication) {
        CustomOAuth2UserDTO user = (CustomOAuth2UserDTO) authentication.getPrincipal();
        List<CosmeticResponseDTO> likedCosmetics = cosmeticService.getInterestedCosmetics(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(likedCosmetics));
    }

}
