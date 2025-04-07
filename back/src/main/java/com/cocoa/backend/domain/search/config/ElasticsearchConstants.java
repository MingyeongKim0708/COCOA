package com.cocoa.backend.domain.search.config;

public final class ElasticsearchConstants {

    // 검색 대상 문서들이 저장될 ES 인덱스
    public static final String SEARCH_INDEX = "search-index";
    public static final String AUTOCOMPLETE_INDEX = "autocomplete-index";

//    // FIELD : 검색 대상이 되는 필드
//    public static final String FIELD_NAME = "name";
//    public static final String FIELD_BRAND = "brand";
//    public static final String FIELD_KEYWORD = "keyword";

    // 분석기 설정(자동 완성 기능 구현 시)
    public static final String ANALYZER_AUTOCOMPLETE = "autocomplete_analyzer";
    public static final String TOKEN_FILTER_AUTOCOMPLETE = "autocomplete_filter";

    private ElasticsearchConstants() {

    }

}