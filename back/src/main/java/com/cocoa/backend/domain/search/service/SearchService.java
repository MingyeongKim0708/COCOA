package com.cocoa.backend.domain.search.service;
// 검색만 담당

import com.cocoa.backend.domain.search.dto.request.SearchRequestDto;
import com.cocoa.backend.domain.search.dto.response.SearchResponseDto;
import com.cocoa.backend.domain.search.entity.SearchDocument;

import com.cocoa.backend.domain.search.repository.SearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

// @Autowired가 아니라 생성자 주입 방식 @RequiredArgsConstructor 사용하는 것이 좋음 -> 왜?
// 이 클래스가 서비스 계층(Service Layer) 에 속한다는 것을 Spring에게 알려주는 어노테이션
@Service
//@RequiredArgsConstructor
//→ final이나 @NonNull 필드에 대해 자동으로 생성자를 만들어주는 Lombok 애노테이션이야.
//→ 생성자 주입 방식이기 때문에 @Autowired를 쓰지 않아도 의존성 주입이 가능해.
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    // final : final
    //→ 한 번 초기화되면 변경되지 않음을 보장해.
    //→ 주입된 후에 실수로 바뀌는 걸 방지해서 안정성이 높아져.
    //searchRepository
    //→ Elasticsearch와 연결된 Repository야.
    //→ 내부적으로는 ElasticsearchRepository<SearchDocument, String>를 상속해서, 검색 관련 쿼리를 실행할 수 있어.
    private final SearchRepository searchRepository; // 왜 final

    //searchCosmetics() 메서드는 이름과 브랜드로 화장품을 검색하는 메서드야
    //SearchRequestDto에는 사용자가 검색하고자 하는 name, brand 정보가 들어 있어.

    //searchRepository.findByNameContainingOrBrandContaining(...)
    //→ Elasticsearch에서 이름에 특정 단어가 포함되었거나 브랜드에 특정 단어가 포함된 화장품을 찾아줘. → 예: name = "토너", brand = "이니스프리"라면 "토너"를 이름에 포함하거나 브랜드가 "이니스프리"인 모든 상품을 가져옴.
    //결과로 SearchDocument 객체 리스트가 반환돼.
    //→ 이건 Elasticsearch에 저장된 문서(document) 형식이야.
    public List<SearchResponseDto> searchCosmetics(SearchRequestDto requestDto) {
        log.info("검색 요청 들어옴 : name={}, brand={}", requestDto.getName(), requestDto.getBrand());
        List<SearchDocument> cosmetics = searchRepository.findByNameContainingOrBrandContaining(
                requestDto.getName(), requestDto.getBrand());
        log.info("검색 결과 개수 : {}", cosmetics.size());

        for (SearchDocument doc : cosmetics) {
            log.info("📄 Document: {}", doc); // toString() 오버라이딩 되어 있으면 여기서 전체 출력됨
        }

        /*이 부분은 Java의 Stream API를 활용해서, 가져온 SearchDocument 리스트를 클라이언트에 줄 수 있도록 SearchResponseDto로 바꿔주는 과정이야.

stream()
→ 리스트를 하나씩 순회할 수 있도록 스트림을 생성해.

.map(...)
→ 각각의 SearchDocument를 SearchResponseDto로 변환해.

new SearchResponseDto(...)
→ 응답으로 보낼 DTO(Data Transfer Object)를 생성해.
이 DTO에는 cosmeticId, name, brand만 들어 있어.

.collect(Collectors.toList())
→ 변환된 결과들을 다시 리스트 형태로 모아줌.*/
        return cosmetics.stream()
                .filter(Objects::nonNull)
                .filter(doc -> doc.getCosmeticId() != null && doc.getName() != null && doc.getBrand() != null)
                .map(search -> new SearchResponseDto(
                        search.getCosmeticId(),
                        search.getName(),
                        search.getBrand()))
                .collect(Collectors.toList());
    }


}