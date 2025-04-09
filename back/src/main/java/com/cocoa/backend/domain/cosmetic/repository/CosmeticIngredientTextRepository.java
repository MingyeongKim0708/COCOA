package com.cocoa.backend.domain.cosmetic.repository;

import com.cocoa.backend.domain.cosmetic.entity.Category;
import com.cocoa.backend.domain.cosmetic.entity.CosmeticIngredientText;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CosmeticIngredientTextRepository extends JpaRepository<CosmeticIngredientText, Integer> {
}
