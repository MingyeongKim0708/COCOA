package com.cocoa.backend.domain.search.service;
// 색인만 담당

import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.search.repository.SearchCosmeticRepository;
import com.cocoa.backend.domain.search.repository.SearchRepository;
import com.cocoa.backend.domain.search.entity.SearchDocument;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// DB 데이터를 Elasticsearch로 색인하기 위함
// PostgreSQL 데이터를 Elasticsearch로 동기화하는 서비스
// RDB에서 가져온 데이터를 JSON 문서로 변환해 Elasticsearch에 저장

@Service
@RequiredArgsConstructor
public class SearchIndexService {

    private final SearchRepository searchRepository; // 여기까지만 쓰면 안되고 의존성 주입받아야함
    private final SearchCosmeticRepository searchCosmeticRepository;

    @PostConstruct
    public void init() {
        indexAll();
    }

    /*전체 DB 데이터를 가져와서 Elasticsearch에 한 번에 넣음
     * 서버 시작 시 초기 색인*/
    public void indexAll() {
        List<Cosmetic> cosmetics = searchCosmeticRepository.findAll();  // PostgreSQL의 Cosmetic 전체 조회
        List<SearchDocument> docs = cosmetics.stream()
                .map(c -> new SearchDocument(
                        String.valueOf(c.getCosmeticId()), // ID는 Elasticsearch에서 String으로 관리
                        c.getName(),
                        c.getBrand()))
                .collect(Collectors.toList());

        searchRepository.saveAll(docs); // -> Elasticsearch에 일괄 저장 (색인)
    }

    /*새로운 Cosmetic이 등록되면 대상 데이터를 Elasticsearch에 넣음
     * 신규 등록 시 자동 색인*/
    public void indexOne(Cosmetic cosmetic) {
        SearchDocument doc = new SearchDocument(
                String.valueOf(cosmetic.getCosmeticId()),
                cosmetic.getName(),
                cosmetic.getBrand());

        searchRepository.save(doc);
    }

}
