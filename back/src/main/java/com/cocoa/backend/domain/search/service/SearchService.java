package com.cocoa.backend.domain.search.service;
// 검색만 담당

import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.search.dto.request.SearchRequestDto;
import com.cocoa.backend.domain.search.dto.response.SearchResponseDto;
import com.cocoa.backend.domain.search.entity.SearchDocument;

import com.cocoa.backend.domain.search.repository.SearchCosmeticRepository;
import com.cocoa.backend.domain.search.repository.SearchRepository;
import com.cocoa.backend.global.redis.RedisService;
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
    private final SearchRepository searchRepository;
    private final SearchCosmeticRepository searchCosmeticRepository;
    private final RedisService redisService;

    //searchCosmetics() 메서드는 이름과 브랜드로 화장품을 검색하는 메서드

    //searchRepository.findByNameContainingOrBrandContaining(...)
    //→ Elasticsearch에서 이름에 특정 단어가 포함되었거나 브랜드에 특정 단어가 포함된 화장품을 찾아줘. → 예: name = "토너", brand = "이니스프리"라면 "토너"를 이름에 포함하거나 브랜드가 "이니스프리"인 모든 상품을 가져옴.
    //결과로 SearchDocument 객체 리스트가 반환돼.
    //→ 이건 Elasticsearch에 저장된 문서(document) 형식이야.
    public List<SearchResponseDto> searchCosmetics(SearchRequestDto requestDto) {
        String name = requestDto.getName();
        String brand = requestDto.getBrand();
        String topKeyword = requestDto.getTopKeyword();

        log.info("검색 요청 들어옴 : name={}, brand={}, topKeyword={}", name, brand, topKeyword);
        boolean isNameEmpty = name == null || name.trim().isEmpty();
        boolean isBrandEmpty = brand == null || brand.trim().isEmpty();
        boolean isKeywordEmpty = topKeyword == null || topKeyword.trim().isEmpty();

        // 모든 필드가 비어있을 경우
        if (isNameEmpty && isBrandEmpty && isKeywordEmpty) {
            log.warn("⚠️ name, brand, topKeyword 모두 비어 있어 검색 불가");
            return List.of();
        }

        // 최근 검색어 저장(이름 기반으로 저장)
        if (userId != null && !isNameEmpty) {
            redisService.saveSearchLog(userId, name);
        }

        List<SearchDocument> results;

        // 모든 필드가 채워져 있을 경우
        if (!isNameEmpty && !isBrandEmpty && !isKeywordEmpty) {
            // name AND brand AND topKeyword
            results = searchRepository.findByNameContainingAndBrandContainingAndTopKeywordContaining(name, brand, topKeyword);
        } else if (!isNameEmpty && !isBrandEmpty) {
            // name AND brand
            results = searchRepository.findByNameContainingAndBrandContaining(name, brand);
        } else if (!isNameEmpty && !isKeywordEmpty) {
            // name AND topKeyword
            results = searchRepository.findByNameContainingAndTopKeywordContaining(name, topKeyword);
        } else if (!isBrandEmpty && !isKeywordEmpty) {
            // brand AND topKeyword
            results = searchRepository.findByBrandContainingAndTopKeywordContaining(brand, topKeyword);
        } else if (!isNameEmpty) {
            results = searchRepository.findByNameContaining(name);
        } else if (!isBrandEmpty) {
            results = searchRepository.findByBrandContaining(brand);
        } else {
            results = searchRepository.findByTopKeywordContaining(topKeyword);
        }

        log.info("📦 검색 결과 수: {}", results.size());
        results.forEach(doc -> log.debug("📄 문서: {}", doc));

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
        return results.stream()
                .filter(Objects::nonNull)
                .filter(doc -> doc.getCosmeticId() != null && doc.getName() != null && doc.getBrand() != null)
                .map(search -> {
                    Integer cosmeticId = Integer.valueOf(search.getCosmeticId());
                    Cosmetic cosmetic = searchCosmeticRepository.findById(cosmeticId).orElse(null);

                    // ✅ imageUrl1 없을 경우 기본 이미지 경로 사용
                    String imageUrl1 = (cosmetic != null && cosmetic.getImageUrl1() != null)
                            ? cosmetic.getImageUrl1()
                            : "profile-image/default_profile.png";

                    String fullImageUrl = String.format("%s", imageUrl1);

                    // 최근 본 상품 이미지 저장
                    if(userId != null){
                        redisService.saveLatestCosmeticImage(userId, cosmeticId, imageUrl1);
                    }

                    // ✅ S3_URL과 경로를 결합
                    return new SearchResponseDto(
                            search.getCosmeticId(),
                            search.getName(),
                            search.getBrand(),
                            search.getTopKeyword(),
                            fullImageUrl
                    );
                })
                .collect(Collectors.toList());
    }
}