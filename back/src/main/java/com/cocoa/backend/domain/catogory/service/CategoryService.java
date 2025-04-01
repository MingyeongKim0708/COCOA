package com.cocoa.backend.domain.catogory.service;

import com.cocoa.backend.domain.catogory.dto.response.CategoryResponseDto;

import java.util.List;

public interface CategoryService {
    List<CategoryResponseDto> getAllCategories();

}
