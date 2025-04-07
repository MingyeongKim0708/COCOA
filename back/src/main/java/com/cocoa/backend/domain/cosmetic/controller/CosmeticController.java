package com.cocoa.backend.domain.cosmetic.controller;

import com.cocoa.backend.domain.cosmetic.dto.response.CategoryResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.service.CategoryService;
import com.cocoa.backend.domain.cosmetic.service.CosmeticService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@Tag(name = "Category API", description = "카테고리 목록 조회 API")
public class CosmeticController {

    private final CategoryService categoryService;
    private final CosmeticService cosmeticService;

    public CosmeticController(CategoryService categoryService, CosmeticService cosmeticService) {
        this.categoryService = categoryService;
        this.cosmeticService = cosmeticService;
    }

    @Operation(summary = "카테고리 전체 조회", description = "모든 카테고리를 조회합니다.")
    @GetMapping("/category")
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> getAllCategires() {
        log.info("GET /category 요청 처리 시작");
        List<CategoryResponseDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(categories));
    }

    @Operation(summary = "카테고리별 제품 조회", description = "해당 카테고리에 속한 제품을 조회합니다.")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<CosmeticResponseDTO>>> getCosmeticsByCategory(
            @PathVariable Integer categoryId,
            Authentication authentication) {

        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        Long userId = userDetails.getUserId();

        List<CosmeticResponseDTO> cosmetics = cosmeticService.getCosmeticsByCategoryId(categoryId, userId);
        return ResponseEntity.ok(ApiResponse.success(cosmetics));
    }


}
