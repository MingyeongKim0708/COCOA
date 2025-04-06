package com.cocoa.backend.domain.cosmetic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CosmeticResponseDTO {
    private Integer cosmeticId;
    private String name;
    private String brand;
    private String optionName;

    // 이미지 URL들을 리스트로 통합
    private List<String> images;

    // 키워드 정보
    private Map<String, Integer> keywords;
    private List<String> topKeywords;

    // 사용자별 관심 여부
    private boolean isLiked;
    private long likeCount;
    private int reviewCount;

    // 카테고리 정보도 DTO 형태로 포함 (예: major/middleCategory 등)
    private CategoryResponseDTO category;

    // 선택적 성분 정보 (없으면 생략 가능)
    private List<String> ingredient;
}
