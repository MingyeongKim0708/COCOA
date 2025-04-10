package com.cocoa.backend.domain.cosmetic.dto.response;

import com.cocoa.backend.domain.review.dto.ReviewDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
@AllArgsConstructor
@Getter
public class CosmeticDetailResponseDTO {
    private CosmeticResponseDTO cosmetic;
    private List<ReviewDTO> reviews;
}
