package com.cocoa.backend.domain.user.dto;

import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
public class KakaoResponse implements OAuth2Response {
    // 데이터 받을 맵 형식
    private final Map<String, Object> attribute;

    public KakaoResponse(Map<String, Object> attribute) {
        this.attribute = attribute;
        log.info("Kakao Response: {}", attribute);
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getProviderId() {
        return attribute.get("id").toString();
    }
}
