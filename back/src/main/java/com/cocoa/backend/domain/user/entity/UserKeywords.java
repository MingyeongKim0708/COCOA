package com.cocoa.backend.domain.user.entity;

import com.cocoa.backend.global.converter.KeywordJsonConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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

    public UserKeywords(User user) {
        this.userId = user.getUserId();
        this.keywords = null;
        this.topKeywords = null;
    }
}
