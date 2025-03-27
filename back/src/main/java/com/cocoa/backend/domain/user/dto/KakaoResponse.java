package com.cocoa.backend.domain.user.dto;

import java.util.Map;

public class KakaoResponse implements OAuth2Response {
    // 데이터 받을 맵 형식
    private final Map<String, Object> attribute;

    public KakaoResponse(Map<String, Object> attribute) {
        this.attribute = (Map<String, Object>) attribute.get("response");
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
