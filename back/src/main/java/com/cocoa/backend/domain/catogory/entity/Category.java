package com.cocoa.backend.domain.catogory.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cosmetic_categories")
@Getter
@NoArgsConstructor (access = AccessLevel.PROTECTED)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "major_category")
    private String majorCategory;

    @Column(name = "middle_category")
    private String middleCategory;

    @Column(name = "category_no")
    private String categoryNo;


}
