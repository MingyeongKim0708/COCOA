package com.cocoa.backend.domain.search.repository;

import com.cocoa.backend.domain.cosmetic.entity.CosmeticKeywords;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CosmeticKeywordRepository extends JpaRepository<CosmeticKeywords, Integer> {
    Optional<CosmeticKeywords> findByCosmeticId(Integer cosmeticId);
}
