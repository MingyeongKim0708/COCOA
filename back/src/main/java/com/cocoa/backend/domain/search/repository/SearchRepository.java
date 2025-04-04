package com.cocoa.backend.domain.search.repository;

import com.cocoa.backend.domain.search.entity.SearchDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SearchRepository extends ElasticsearchRepository<SearchDocument, String> {
    List<SearchDocument> findByNameContainingOrBrandContaining(String name, String brand);
}