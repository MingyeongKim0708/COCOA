package com.cocoa.backend.domain.search.repository;
// PostgreSQL에서 데이터를 저장하고 불러오기 위한 JpaRepository를 만듦
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// JpaRepository<Cosmetic, Integer> → PostgreSQL에 데이터 저장 & 조회를 위한 기본적인 CRUD 지원
public interface CosmeticRepository extends JpaRepository<Cosmetic, Integer> {
}
