package com.cocoa.backend.domain.search.repository;
// Elasticsearch에서 검색을 수행할 때 사용할 ElasticsearchRepository

import com.cocoa.backend.domain.search.entity.SearchDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchRepository extends ElasticsearchRepository<SearchDocument, String> {
    List<SearchDocument> findByNameContainingOrBrandContaining(String name, String brand);
    List<SearchDocument> findByNameContaining(String name);
    List<SearchDocument> findByBrandContaining(String brand);


//    List<SearchDocument> findByNameContaining(String name, String brand, Pageable pageable);
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