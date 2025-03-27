package com.cocoa.backend.domain.user.entity;

public enum SkinType {
    DRY("건성"),
    OILY("지성"),
    NORMAL("중성"),
    COMBINATION("복합성"),
    DEHYDRATED("수부지");

    private final String krName;

    SkinType(String krName) {
        this.krName = krName;
    }

    public String getKrName() {
        return krName;
    }
}
