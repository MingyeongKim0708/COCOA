package com.cocoa.backend.domain.catogory.controller;

import com.cocoa.backend.domain.catogory.dto.response.CategoryResponseDto;
import com.cocoa.backend.domain.catogory.service.CategoryService;
import com.cocoa.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/category")
@Tag(name = "Category API", description = "카테고리 목록 조회 API")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "카테고리 전체 조회", description = "모든 카테고리를 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getAllCategires() {
        log.info("GET /api/category 요청 처리 시작");
        List<CategoryResponseDto> categories = categoryService.getAllCategories();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(categories));
    }

    @GetMapping("/error-test")
    public ResponseEntity<ApiResponse<?>> triggerError() {
        throw new RuntimeException("임의 에러 발생 테스트");
    }

}
