package com.cocoa.backend.domain.search.controller;

import com.cocoa.backend.domain.search.dto.request.SearchRequestDto;
import com.cocoa.backend.domain.search.dto.response.SearchResponseDto;
import com.cocoa.backend.domain.search.service.SearchService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    /*기본 검색 기능*/
    @GetMapping("")
    public ResponseEntity<ApiResponse<List<SearchResponseDto>>> searchCosmetics(@ModelAttribute SearchRequestDto requestDto, Authentication authentication) {
        try {
            Long userId = null;
            if (authentication != null && authentication.isAuthenticated()) {
               CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
               userId = userDetails.getUserId(); 
            }

            List<SearchResponseDto> result = searchService.searchCosmetics(requestDto, userId);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("SERVER_ERROR","검색 에러 발생 : " + e.getMessage()));
        }
    }

}