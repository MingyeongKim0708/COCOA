package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;

import java.util.List;

public interface CosmeticService {
    List<CosmeticResponseDTO> getCosmeticsByCategoryId(Integer categoryId, Long userId);

}
