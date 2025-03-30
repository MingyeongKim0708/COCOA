package com.cocoa.backend.domain.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "birth_year")
    private Short birthYear;

    @Column(name = "birth_month")
    private Short birthMonth;

    @Column(name = "birth_day")
    private Short birthDay;

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

//    @Column(name = "key_words", columnDefinition = "jsonb")
//    private String keyWords;
}
