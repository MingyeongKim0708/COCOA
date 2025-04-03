package com.cocoa.backend.domain.user.entity;

import com.cocoa.backend.global.converter.KeywordJsonConverter;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.Map;

@Entity
@Getter
@Table(name = "user_keywords")
public class UserKeywords {
    @Id
    private Long userId;

    @Column(columnDefinition = "jsonb")
    @Convert(converter = KeywordJsonConverter.class)
    private Map<String, Integer> keywords;

    @Column(columnDefinition = "jsonb")
    @Convert(converter = KeywordJsonConverter.class)
    private Map<String, Integer> topKeywords;
}
