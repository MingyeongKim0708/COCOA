package com.cocoa.backend.domain.cosmetic.controller;

import com.cocoa.backend.domain.cosmetic.dto.response.CategoryResponseDto;
import com.cocoa.backend.domain.cosmetic.service.CategoryService;
import com.cocoa.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/category")
@Tag(name = "Category API", description = "카테고리 목록 조회 API")
public class CosmeticController {

    private final CategoryService categoryService;

    public CosmeticController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "카테고리 전체 조회", description = "모든 카테고리를 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getAllCategires() {
        log.info("GET /category 요청 처리 시작");
        List<CategoryResponseDto> categories = categoryService.getAllCategories();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(categories));
    }

}
