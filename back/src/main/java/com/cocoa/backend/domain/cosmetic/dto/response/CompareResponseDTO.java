package com.cocoa.backend.domain.cosmetic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Getter
@AllArgsConstructor
public class CompareResponseDTO {
    Integer cosmeticId;
    String brand;
    String name;
    String imageUrl;
    List<CompareKeywordDTO> top5Keywords;
    Set<String> matchedKeywords;
//    String ingredients;
}
