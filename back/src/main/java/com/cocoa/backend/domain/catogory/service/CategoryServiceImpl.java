package com.cocoa.backend.domain.catogory.service;

// 프론트로 보낼 DTO

import com.cocoa.backend.domain.catogory.dto.response.CategoryResponseDto;

// JPA 엔티티(DB에서 가져온 데이터)
import com.cocoa.backend.domain.catogory.entity.Category;

// DB와 통신하는 역할
import com.cocoa.backend.domain.catogory.repository.CategoryRepository;

// 이 클래스가 서비스 계층임을 나타냄. Spring이 자동으로 Bean 등록해줌
import com.cocoa.backend.global.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

// 리스트, 스트림 등 자바 기본 라이브러리 사용
import java.util.List;
import java.util.stream.Collectors;

// @Slf4j : 로그 출력을 위한 어노테이션
// @Service : 이 클래스가 Service 컴포넌트라는 걸 Spring에게 알려줌
// CategoryService 인터페이스를 실제로 구현한 클래스라는 뜻
@Slf4j
@Service
public class CategoryServiceImpl implements CategoryService {
    // 의존성 주입(생성자 주입 방식)
    // DB와 통신하기 위해 Repository를 필드로 선언
    private final CategoryRepository categoryRepository;

    // Spring이 자동으로 Repository 객체를 넣어줌 (생성자 기반 의존성 주입)
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // CategoryService에서 정의한 메서드 구현 중 (인터페이스 메서드 구현)
    @Override
    public List<CategoryResponseDto> getAllCategories() {
        // Repository에서 모든 카테고리 엔티티를 가져옴 (DB SELECT * FROM cosmetic_categories)
        List<Category> categories = categoryRepository.findAll();

        // log 출력 (변경시 서버 재실행 필요)
        log.info("✅ 카테고리 개수: {}", categories.size());
        categories.forEach(c ->
                log.debug("🟣 {} | {} > {}", c.getCategoryId(), c.getMajorCategory(), c.getMiddleCategory())
        );

        // 가져온 List<Category>를 스트림으로 변환(for문 처럼 하나씩 처리할 수 있음)
        return categories.stream()
                // 각 Category 객체를 CategoryResponseDto로 변환
                // map은 변환 작업을 위한 함수
                // collect는 변환된 결과를 다시 List로 모아서 리턴
                .map(c -> new CategoryResponseDto(
                        c.getCategoryId(),
                        c.getMajorCategory(),
                        c.getMiddleCategory(),
                        c.getCategoryNo()
                ))
                .collect(Collectors.toList());
    }


}

// 나중에 주석 삭제할게요