package com.cocoa.backend.domain.search.service;
// 색인만 담당

import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.cosmetic.entity.CosmeticKeywords;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticRepository;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticKeywordRepository;
import com.cocoa.backend.domain.search.repository.SearchCosmeticRepository;
import com.cocoa.backend.domain.search.repository.SearchRepository;
import com.cocoa.backend.domain.search.entity.SearchDocument;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

// DB 데이터를 Elasticsearch로 색인하기 위함
// PostgreSQL 데이터를 Elasticsearch로 동기화하는 서비스
// RDB에서 가져온 데이터를 JSON 문서로 변환해 Elasticsearch에 저장

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchIndexService {

    private final SearchRepository searchRepository; // Elasticsearch 저장소
    private final SearchCosmeticRepository searchCosmeticRepository; // PostgreSQL 저장소
    private final CosmeticRepository cosmeticRepository;
    private final CosmeticKeywordRepository cosmeticKeywordRepository; // 키워드 조회용
    /**
     * 서버 시작 시 전체 색인 수행
     */
    @PostConstruct
    public void init() {
        indexAll();
    }

    /*전체 DB 데이터를 가져와서 Elasticsearch에 한 번에 넣음
     * 🔁 전체 색인: DB의 모든 화장품 정보를 Elasticsearch로 저장
     */
    /**
     * 전체 색인
     */
    public void indexAll() {
        List<Cosmetic> cosmetics = searchCosmeticRepository.findAll();

        List<SearchDocument> docs = cosmetics.stream()
                .map(cosmetic -> {
                    String keywords = extractKeywords(cosmetic.getCosmeticId());

                    return new SearchDocument(
                            String.valueOf(cosmetic.getCosmeticId()),
                            cosmetic.getName(),
                            cosmetic.getBrand(),
                            keywords
                    );
                })
                .collect(Collectors.toList());

        log.info("색인할 문서 수: {}", docs.size());
        searchRepository.saveAll(docs);
    }

    /**
     * 단일 색인
     */
    public void indexOne(Cosmetic cosmetic) {
        String keywords = extractKeywords(cosmetic.getCosmeticId());

        SearchDocument doc = new SearchDocument(
                String.valueOf(cosmetic.getCosmeticId()),
                cosmetic.getName(),
                cosmetic.getBrand(),
                keywords
        );

        log.info("색인할 단일 문서: {}", doc);
        searchRepository.save(doc);
    }

    /**
     * CosmeticId로부터 keywords 문자열 추출
     * Map<String, Integer>를 받아 키1,키2,... 형태의 문자열로 변환
     */
    private String extractKeywords(Integer cosmeticId) {
        Optional<CosmeticKeywords> optional = cosmeticKeywordRepository.findByCosmeticId(cosmeticId);
        if (optional.isEmpty()) return "";

        Map<String, Integer> keywords = optional.get().getKeywords();
        if (keywords == null || keywords.isEmpty()) return "";

        // 상위 3개의 키워드만 선택
        return keywords.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue())) // 내림차순
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.joining(","));
    }

}
