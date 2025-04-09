package com.cocoa.backend.domain.cosmetic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompareModalResponseDTO {
    private Integer itemId;
    private String brand;
    private String name;
    private String imageUrl;
}
