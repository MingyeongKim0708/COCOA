package com.cocoa.backend.domain.cosmetic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class CompareResponseDTO {
    Integer cosmeticId;
    String brand;
    String name;
    String imageUrl;
    Map<String, Integer> top5Keywords;
    List<String> matchedKeywords;
//    String ingredients;
}
