package com.cocoa.backend.domain.search.dto.response;

import lombok.Getter;

@Getter
public class SearchResponseDto {
    private final String cosmeticId;
    private final String name;
    private final String brand;
    private final String topKeyword;

    public SearchResponseDto(String cosmeticId, String name, String brand, String topKeyword) {
        this.cosmeticId = cosmeticId;
        this.name = name;
        this.brand = brand;
        this.topKeyword = topKeyword;

    }
}
//cosmeticId, name, brand라는 3개의 필드를 가진 응답 객체.
//이 응답은 SearchService에서 List<SearchDocument> → List<SearchResponseDto>로 변환되어 반환.