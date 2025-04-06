package com.cocoa.backend.domain.cosmetic.entity;

import java.util.Map;

import com.cocoa.backend.global.converter.KeywordJsonConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "cosmetic_keywords")
public class CosmeticKeywords {
    @Id
    private Integer cosmeticId;

    @Column(columnDefinition = "jsonb")
    @Convert(converter = KeywordJsonConverter.class)
    private Map<String, Integer> keywords;

    @Column(columnDefinition = "jsonb")
    @Convert(converter = KeywordJsonConverter.class)
    private Map<String, Integer> topKeywords;
}
