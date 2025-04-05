package com.cocoa.backend.domain.search.dto.response;

import lombok.Getter;

@Getter
public class SearchResponseDto {
    private final String cosmeticId;
    private final String name;
    private final String brand;

    public SearchResponseDto(String cosmeticId, String name, String brand) {
        this.cosmeticId = cosmeticId;
        this.name = name;
        this.brand = brand;

    }
}