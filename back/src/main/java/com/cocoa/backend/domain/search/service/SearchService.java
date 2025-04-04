package com.cocoa.backend.domain.search.service;

import com.cocoa.backend.domain.search.dto.request.SearchRequestDto;
import com.cocoa.backend.domain.search.dto.response.SearchResponseDto;
import com.cocoa.backend.domain.search.entity.SearchDocument;
import com.cocoa.backend.domain.search.repository.SearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// @Autowired가 아니라 생성자 주입 방식 @RequiredArgsConstructor 사용하는 것이 좋음 -> 왜?
@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchRepository searchRepository;

    public List<SearchResponseDto> searchCosmetics(SearchRequestDto requestDto) {
        List<SearchDocument> cosmetics = searchRepository.findByNameContainingOrBrandContaining(
                requestDto.getName(), requestDto.getBrand());

        return cosmetics.stream()
                .map(search -> new SearchResponseDto(
                        search.getCosmeticId(),
                        search.getName(),
                        search.getBrand()))
                .collect(Collectors.toList());
    }

}