package com.cocoa.backend.domain.cosmetic.repository;

import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CosmeticRepository extends JpaRepository<Cosmetic, Integer> {
    List<Cosmetic> findByCategory_CategoryId(Integer categoryId);

    @Query("SELECT c FROM Cosmetic c " +
            "WHERE c.category.categoryId = :categoryId " +
            "AND (:lastId IS NULL OR c.cosmeticId > :lastId) " +
            "ORDER BY c.cosmeticId ASC")
    List<Cosmetic> findCosmeticsByCursor(
            @Param("categoryId") Integer categoryId,
            @Param("lastId") Integer lastId,
            Pageable pageable);
}