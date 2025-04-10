package com.cocoa.backend.domain.cosmetic.controller;

import com.cocoa.backend.domain.cosmetic.dto.request.CompareRequestDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CategoryResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CompareModalResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CompareResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.service.CategoryService;
import com.cocoa.backend.domain.cosmetic.service.CompareService;
import com.cocoa.backend.domain.cosmetic.service.CosmeticService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@Tag(name = "Cosmetic API", description = "화장품 관련 API")
public class CosmeticController {

    private final CategoryService categoryService;
    private final CompareService compareService;
    private final CosmeticService cosmeticService;

    public CosmeticController(CategoryService categoryService, CompareService compareService, CosmeticService cosmeticService) {
        this.categoryService = categoryService;
        this.compareService = compareService;
        this.cosmeticService = cosmeticService;
    }

    @GetMapping("/cosmetic/{cosmeticId}")
    public ResponseEntity<ApiResponse<CosmeticResponseDTO>> getCosmeticByCosmeticId(Authentication authentication, @PathVariable int cosmeticId){
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO)authentication.getPrincipal();

        CosmeticResponseDTO cosmetic= cosmeticService.getCosmeticsByCosmeticId(userDetails.getUserId(), cosmeticId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(cosmetic));
    }

    @Operation(summary = "카테고리 전체 조회", description = "모든 카테고리를 조회합니다.")
    @GetMapping("/category")
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> getAllCategires() {
        log.info("GET /category 요청 처리 시작");
        List<CategoryResponseDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(categories));
    }

    @Operation(summary = "카테고리별 제품 조회 (cursor 기반)", description = "해당 카테고리에 속한 제품을 조회합니다.")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCosmeticsByCategory(
            @PathVariable Integer categoryId,
            @RequestParam(required = false) Integer lastId,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        Long userId = userDetails.getUserId();

//        List<CosmeticResponseDTO> cosmetics = cosmeticService.getCosmeticsByCategoryId(categoryId, userId);
        List<CosmeticResponseDTO> cosmetics = cosmeticService.getCosmeticsByCursor(categoryId, lastId, size, userId);


        boolean hasNext = cosmetics.size() == size;
        Integer nextCursor = hasNext ? cosmetics.get(cosmetics.size() - 1).getCosmeticId() : null;

        Map<String, Object> result = new HashMap<>();
        result.put("data", cosmetics);
        result.put("hasNext", hasNext);
        result.put("nextCursor", nextCursor);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @Operation(summary = "비교함에 등록된 제품id 조회")
    @GetMapping("/compare-ids")
    public ResponseEntity<ApiResponse<List<Integer>>> getCompareItemIds(Authentication authentication) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        List<Integer> compareItemIds = compareService.getCompareItemIds(userDetails.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(compareItemIds));
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

    @Operation(summary = "비교함 전체 삭제")
    @DeleteMapping("/compare")
    public ResponseEntity<ApiResponse<Void>> removeAllCompareItems(Authentication authentication) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        compareService.removeAllCompareItems(userDetails.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null));
    }
}
