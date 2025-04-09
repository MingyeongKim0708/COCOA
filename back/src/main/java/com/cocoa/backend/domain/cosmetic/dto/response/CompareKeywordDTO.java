package com.cocoa.backend.domain.cosmetic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompareKeywordDTO {
    private String keyword;
    private Integer count;
    private boolean matched;
}
