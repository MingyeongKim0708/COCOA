package com.cocoa.backend.domain.cosmetic.dto.request;

import lombok.Data;

@Data
public class CompareRequestDTO {
    private Long originalItemId;
    private Long newItemId;
}
