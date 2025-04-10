package com.cocoa.backend.domain.search.controller;

import com.cocoa.backend.domain.search.dto.request.SearchRequestDto;
import com.cocoa.backend.domain.search.dto.response.SearchResponseDto;
import com.cocoa.backend.domain.search.service.SearchService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
@Slf4j
public class SearchController {
    private final SearchService searchService;

    // 기본 검색 기능
    @GetMapping
    public ResponseEntity<ApiResponse<List<SearchResponseDto>>> searchCosmetics(@ModelAttribute SearchRequestDto requestDto, Authentication authentication) {
        try {
            Long userId = null;
            if (authentication != null && authentication.isAuthenticated()) {
                CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
                userId = userDetails.getUserId();
            }
            // searchService로 userId 전달
            List<SearchResponseDto> result = searchService.searchCosmetics(requestDto, userId);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("SERVER_ERROR", "검색 에러 발생 : " + e.getMessage()));
        }
    }

    // 최근 검색어
    @Operation(summary = "최근 검색어 조회", description = "로그인된 사용자의 최근 검색어 목록을 반환합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/recentLog")
    public ResponseEntity<ApiResponse<List<String>>> getRecentSearchLogs(Authentication authentication) {
        log.info("Authentication: {}", authentication);
        if (authentication != null) {
            log.info("Principal: {}", authentication.getPrincipal());
        }
        try {
            Long userId = null;
            if (authentication != null && authentication.isAuthenticated()) {
                CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
                userId = userDetails.getUserId();
            }

            List<String> recentSearchLogs = searchService.getRecentSearchLogs(userId);
            return ResponseEntity.ok(ApiResponse.success(recentSearchLogs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SERVER_ERROR", " 최근 검색어 조회 중 오류 발생: " + e.getMessage()));
        }
    }

    // 최근 조회 상품
    @GetMapping("/recentCosmetic")
    public ResponseEntity<ApiResponse<List<String>>> getRecentCosmetics(Authentication authentication) {
        log.info("Authentication: {}", authentication);
        if (authentication != null) {
            log.info("Principal: {}", authentication.getPrincipal());
        }
        try {
            Long userId = null;
            if (authentication != null && authentication.isAuthenticated()) {
                CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
                userId = userDetails.getUserId();
                log.info("userId: {}", userId);
            }
            // SearchService의 getRecentCosmetics() 메서드를 호출해서 최근 본 상품들을 조회
            List<String> recentCosmetics = searchService.getRecentCosmetics(userId);
            return ResponseEntity.ok(ApiResponse.success(recentCosmetics));
        } catch (Exception e) {
            // 그 결과를 ApiResponse<List<SearchResponseDto>> 형태로 프론트엔드에 JSON 형식으로 응답
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SERVER_ERROR", "최근 본 상품 조회 중 오류 발생: " + e.getMessage()));
        }
    }

    // 최근 조회 상품 저장 (이미지 클릭 시)
    @PostMapping("/recentCosmetic/{cosmeticId}")
    public ResponseEntity<ApiResponse<String>> saveRecentCosmetic(
            @PathVariable Integer cosmeticId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        try {
            Long userId = null;
            if (authentication != null && authentication.isAuthenticated()) {
                CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
                userId = userDetails.getUserId();
            }
            String imageUrl1 = body.get("imageUrl1"); // JSON에서 key 꺼내기
            searchService.saveRecentCosmetics(userId, cosmeticId, imageUrl1);
            return ResponseEntity.ok(ApiResponse.success("최근 본 상품에 저장 완료"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SERVER_ERROR", "최근 본 상품 저장 중 오류 발생: " + e.getMessage()));
        }
    }

}