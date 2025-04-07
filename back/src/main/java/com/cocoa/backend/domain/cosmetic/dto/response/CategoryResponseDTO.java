package com.cocoa.backend.domain.cosmetic.dto.response;

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

}
