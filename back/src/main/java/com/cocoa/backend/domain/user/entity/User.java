package com.cocoa.backend.domain.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.Map;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10, columnDefinition = "gender")
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "skin_type", length = 20, columnDefinition = "skin_type")
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private SkinType skinType;

    @Enumerated(EnumType.STRING)
    @Column(name = "skin_tone", length = 20, columnDefinition = "skin_tone")
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private SkinTone skinTone;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    private UserKeywords userKeywords;
}
