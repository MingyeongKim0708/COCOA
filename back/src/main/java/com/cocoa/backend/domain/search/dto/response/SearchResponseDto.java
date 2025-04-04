package com.cocoa.backend.domain.search.dto.response;

import lombok.Getter;

@Getter
public class SearchResponseDto {
    private String cosmeticId;
    private String name;
    private String brand;

    public SearchResponseDto(String cosmeticId, String name, String brand) {
        this.cosmeticId = cosmeticId;
        this.name = name;
        this.brand = brand;

    }
}