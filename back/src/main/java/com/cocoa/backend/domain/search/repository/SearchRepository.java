package com.cocoa.backend.domain.search.repository;
// Elasticsearch에서 검색을 수행할 때 사용할 ElasticsearchRepository

import com.cocoa.backend.domain.search.entity.SearchDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchRepository extends ElasticsearchRepository<SearchDocument, String> {
    // 각 필드 단독 검색
    List<SearchDocument> findByNameContaining(String name);

    List<SearchDocument> findByBrandContaining(String brand);

    List<SearchDocument> findByTopKeywordContaining(String topKeyword);

    //  AND 조건 검색
    List<SearchDocument> findByNameContainingAndBrandContaining(String name, String brand);

    List<SearchDocument> findByNameContainingAndTopKeywordContaining(String name, String topKeyword);

    List<SearchDocument> findByBrandContainingAndTopKeywordContaining(String brand, String topKeyword);

    List<SearchDocument> findByNameContainingAndBrandContainingAndTopKeywordContaining(String name, String brand, String topKeyword);
}

//import com.cocoa.backend.domain.search.entity.SearchDocument;
//import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//@Repository
//public interface SearchRepository extends ElasticsearchRepository<SearchDocument, String> {
//    List<SearchDocument> findByNameContainingOrBrandContaining(String name, String brand);
//}