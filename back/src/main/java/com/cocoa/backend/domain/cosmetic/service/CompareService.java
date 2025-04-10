package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CompareModalResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CompareResponseDTO;

import java.util.List;

public interface CompareService {
    List<Integer> getCompareItemIds(Long userId);
    void addOrReplaceCompareItem(Long userId, Long originalItemId, Long newItemId);
    List<CompareModalResponseDTO> getCompareModalItems(Long userId);
    List<CompareResponseDTO> getCompareItems(Long userId);
    void removeAllCompareItems(Long userId);
}
