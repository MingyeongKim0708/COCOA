package com.cocoa.backend.domain.cosmetic.entity;

import com.cocoa.backend.global.converter.IngredientTextJsonConverter;
import com.cocoa.backend.global.converter.KeywordJsonConverter;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.Map;

@Entity
@Getter
@Table(name = "cosmetic_ingredient_text")
public class CosmeticIngredientText {
    @Id
    private Integer cosmeticId;

    @Convert(converter = IngredientTextJsonConverter.class)
    @Column(name = "ingredient_text", columnDefinition = "TEXT")
    private Map<String, String> ingredientText;
}
