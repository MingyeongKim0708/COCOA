package com.cocoa.backend.domain.search.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Getter
@Setter
@Document(indexName = "search-index", createIndex = false)
public class SearchDocument {

    @Id
    private String cosmeticId;

    @Field(type= FieldType.Text) //분석가능한 필드로 지정
    private String name;

    @Field(type= FieldType.Text)
    private String brand;
}