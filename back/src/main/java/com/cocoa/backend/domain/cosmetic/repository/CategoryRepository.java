package com.cocoa.backend.domain.cosmetic.repository;

import com.cocoa.backend.domain.cosmetic.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoryRepository extends JpaRepository<Category, Integer>{
}
