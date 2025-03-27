package com.cocoa.backend.domain.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "birth_year")
    private Short birthYear;

    @Column(name = "birth_month")
    private Short birthMonth;

    @Column(name = "birth_day")
    private Short birthDay;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10, nullable = false)
    private String gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "skin_type", length = 20, nullable = false)
    private String skinType;

    @Enumerated(EnumType.STRING)
    @Column(name = "skin_tone", length = 20, nullable = false)
    private String skinTone;

    @Column(name = "key_words", columnDefinition = "jsonb")
    private String keyWords;
}
