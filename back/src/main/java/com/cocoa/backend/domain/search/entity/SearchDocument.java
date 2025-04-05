package com.cocoa.backend.domain.search.entity;
// 검색을 위한 전용 인덱스 객체
// SearchRepository가 관리

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// search-index : Elasticsearch 색인명(데이터 저장소)
// createIndex = false
@Document(indexName = "search-index")
public class SearchDocument {

    @Id
    private String cosmeticId; // cosmeticId : Elasticsearch에서 문서를 식별하는 식별자(ID)

    // @Field : 분석 가능한 필드로 지정
    // type = FieldType.Text : 기본 값, 분석됨 -> 띄어쓰기/어간 분석
    // Text는 분석되어 부분 일치 가능 - 검색 시 match 쿼리 사용
    // type = FieldType.Keyword : 정확한 일치 비교
    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Text)
    private String brand;
}