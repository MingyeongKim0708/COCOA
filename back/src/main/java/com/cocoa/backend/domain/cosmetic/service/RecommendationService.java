package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;

import java.util.List;

public interface RecommendationService {
    List<CosmeticResponseDTO> getRecommendedCosmetics(Integer categoryId, Long userId);
}
