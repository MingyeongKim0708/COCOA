package com.cocoa.backend.domain.cosmetic.entity;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Entity
@Table(name = "cosmetics")
public class Cosmetic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cosmetic_id")
    private Integer cosmeticId;

    @Column(name = "oliveyoung_id")
    private String oliveyoungId;

    @Column(name = "opt_id")
    private Integer optId;

    @Column(name = "name")
    private String name;

    @Column(name = "option_name")
    private String optionName;

    @Column(name = "brand")
    private String brand;

    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "reputation1")
    private String reputation1;

    @Column(name = "reputation2")
    private String reputation2;

    @Column(name = "reputation3")
    private String reputation3;

    @Column(name = "reputation4")
    private String reputation4;

    @Column(name = "image_url1")
    private String imageUrl1;

    @Column(name = "image_url2")
    private String imageUrl2;

    @Column(name = "image_url3")
    private String imageUrl3;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @Column(name = "oliveyoung_review_amount")
    private Integer oliveyoungReviewAmount;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "cosmetic_id")
    private CosmeticKeywords cosmeticKeywords;
}
