package com.cocoa.backend.domain.catogory.repository;

import com.cocoa.backend.domain.catogory.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoryRepository extends JpaRepository<Category, Integer>{
}
