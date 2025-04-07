package com.cocoa.backend.domain.cosmetic.repository;

import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CosmeticRepository extends JpaRepository<Cosmetic, Integer> {

    List<Cosmetic> findByCategory_CategoryId(Integer categoryId);

}
