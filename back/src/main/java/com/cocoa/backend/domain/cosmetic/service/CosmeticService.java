package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CosmeticResponseDTO;
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;

import java.util.List;

public interface CosmeticService {
    Cosmetic getOneByCosmeticId(Integer cosmeticId);
    List<CosmeticResponseDTO> getCosmeticsByCategoryId(Integer categoryId, Long userId);
    List<CosmeticResponseDTO> getInterestedCosmetics(Long userId);

    // 이미 RedisService에 구현되어 있음
    void addInterest(Long userId, Long cosmeticId);
    void removeInterest(Long userId, Long cosmeticId);

    List<CosmeticResponseDTO> getCosmeticsByCursor(Integer categoryId, Integer lastId, int size, Long userId);

}
