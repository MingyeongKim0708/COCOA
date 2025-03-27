package com.cocoa.backend.domain.user.entity;

public enum SkinTone {
    SPRING_WARM("봄웜톤"),
    SUMMER_COOL("여름쿨톤"),
    AUTUMN_WARM("가을웜톤"),
    WINTER_COOL("겨울쿨톤"),
    NONE("톤모름");

    private final String krName;

    SkinTone(String krName) {
        this.krName = krName;
    }

    public String getKrName() {
        return krName;
    }
}
