package com.cocoa.backend.domain.cosmetic.repository;

import com.cocoa.backend.domain.cosmetic.entity.Category;
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer>{

}
