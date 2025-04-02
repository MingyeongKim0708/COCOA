package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CategoryResponseDto;

import java.util.List;

public interface CategoryService {
    List<CategoryResponseDto> getAllCategories();

}
