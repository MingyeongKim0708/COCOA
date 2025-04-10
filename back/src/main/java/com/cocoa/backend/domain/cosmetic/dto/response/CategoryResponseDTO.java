package com.cocoa.backend.domain.cosmetic.dto.response;

import com.cocoa.backend.domain.cosmetic.entity.Category;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDTO {

    private Integer categoryId;
    private String majorCategory;
    private String middleCategory;
    private String categoryNo;

    public static CategoryResponseDTO fromEntity(Category category){
        return new CategoryResponseDTO(category.getCategoryId(), category.getMajorCategory(),
            category.getMiddleCategory(), category.getCategoryNo());
    }
}
