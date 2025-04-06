package com.cocoa.backend.domain.cosmetic.controller;

import com.cocoa.backend.domain.cosmetic.dto.request.CompareRequestDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CategoryResponseDto;
import com.cocoa.backend.domain.cosmetic.dto.response.CompareModalResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CompareResponseDTO;
import com.cocoa.backend.domain.cosmetic.service.CategoryService;
import com.cocoa.backend.domain.cosmetic.service.CompareService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
public class CosmeticController {

    private final CategoryService categoryService;
    private final CompareService compareService;

    public CosmeticController(CategoryService categoryService, CompareService compareService) {
        this.categoryService = categoryService;
        this.compareService = compareService;
    }

    @Operation(summary = "카테고리 전체 조회", description = "모든 카테고리를 조회합니다.")
    @GetMapping("/category")
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getAllCategires() {
        log.info("GET /category 요청 처리 시작");
        List<CategoryResponseDto> categories = categoryService.getAllCategories();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(categories));
    }

    @Operation(summary = "비교함에 등록 및 교체", description = "originalItemId가 존재하지 않으면 등록, 존재하면 교체")
    @PostMapping("/compare")
    public ResponseEntity<ApiResponse<Void>> addOrReplaceCompareItems(@RequestBody CompareRequestDTO requestDTO, Authentication authentication) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        compareService.addOrReplaceCompareItem(userDetails.getUserId(), requestDTO.getOriginalItemId(), requestDTO.getNewItemId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null));
    }

    @Operation(summary = "비교함 모달 정보 조회")
    @GetMapping("/compare-modal")
    public ResponseEntity<ApiResponse<List<CompareModalResponseDTO>>> getCompareModalItems(Authentication authentication) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        List<CompareModalResponseDTO> compareModalItems = compareService.getCompareModalItems(userDetails.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(compareModalItems));
    }

    @Operation(summary = "비교함 결과 조회")
    @GetMapping("/compare")
    public ResponseEntity<ApiResponse<List<CompareResponseDTO>>> getCompareItems(Authentication authentication) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        List<CompareResponseDTO> compareItems = compareService.getCompareItems(userDetails.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(compareItems));
    }
}
