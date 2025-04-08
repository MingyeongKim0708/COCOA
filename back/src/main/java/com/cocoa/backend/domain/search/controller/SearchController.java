package com.cocoa.backend.domain.search.controller;

import com.cocoa.backend.domain.search.dto.request.SearchRequestDto;
import com.cocoa.backend.domain.search.dto.response.SearchResponseDto;
import com.cocoa.backend.domain.search.service.SearchService;
import com.cocoa.backend.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<SearchResponseDto>>> searchCosmetics(@ModelAttribute SearchRequestDto requestDto) {
        try {
            List<SearchResponseDto> result = searchService.searchCosmetics(requestDto);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("SERVER_ERROR","검색 에러 발생 : " + e.getMessage()));
        }
    }
}