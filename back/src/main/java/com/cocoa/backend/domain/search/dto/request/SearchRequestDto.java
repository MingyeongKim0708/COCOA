package com.cocoa.backend.domain.search.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// @data 쓸때는? 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequestDto {
    private String name;
    private String brand;
    private String topKeyword;
}