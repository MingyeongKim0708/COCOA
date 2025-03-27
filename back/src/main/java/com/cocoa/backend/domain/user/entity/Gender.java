package com.cocoa.backend.domain.user.entity;

public enum Gender {
    FEMALE("여성"),
    MALE("남성");

    private final String krName;

    Gender(String krName) {
        this.krName = krName;
    }

    public String getKrName() {
        return krName;
    }
}
