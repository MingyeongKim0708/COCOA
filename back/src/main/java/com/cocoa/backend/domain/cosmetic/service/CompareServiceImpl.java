package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CompareModalResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CompareResponseDTO;
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.cosmetic.errorcode.CompareErrorCode;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticRepository;
import com.cocoa.backend.domain.user.entity.UserKeywords;
import com.cocoa.backend.domain.user.errorcode.UserErrorCode;
import com.cocoa.backend.domain.user.repository.UserKeywordsRepository;
import com.cocoa.backend.domain.user.repository.UserRepository;
import com.cocoa.backend.global.exception.CustomException;
import com.cocoa.backend.global.redis.RedisService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CompareServiceImpl implements CompareService {
    private final RedisService redisService;
    private final CosmeticRepository cosmeticRepository;
    private final UserKeywordsRepository userKeywordsRepository;

    public CompareServiceImpl(RedisService redisService, CosmeticRepository cosmeticRepository, UserKeywordsRepository userKeywordsRepository) {
        this.redisService = redisService;
        this.cosmeticRepository = cosmeticRepository;
        this.userKeywordsRepository = userKeywordsRepository;
    }

    @Override
    public void addOrReplaceCompareItem(Long userId, Long originalItemId, Long newItemId) {
        if (redisService.isItemInCompare(userId, newItemId)) {
            throw new CustomException(CompareErrorCode.ALREADY_EXISTS);
        }
        if (originalItemId != null) {
            redisService.removeCompareItem(userId, originalItemId);
        }

        String result = redisService.addCompareItem(userId, newItemId);
        switch (result) {
            case "ALREADY_EXISTS" -> throw new CustomException(CompareErrorCode.ALREADY_EXISTS);
            case "MAX_LIMIT_REACHED" -> throw new CustomException(CompareErrorCode.MAX_LIMIT_EXCEEDED);
        }
    }

    @Override
    public List<CompareModalResponseDTO> getCompareModalItems(Long userId) {
        Set<String> itemSet = redisService.getCompareItems(userId);
        List<Integer> itemIds = itemSet.stream()
                .map(Long::parseLong)
                .map(Long::intValue)
                .toList();
        List<Cosmetic> items = cosmeticRepository.findAllById(itemIds);
        return items.stream()
                .map(item -> new CompareModalResponseDTO(
                        item.getCosmeticId(),
                        item.getBrand(),
                        item.getName(),
                        item.getImageUrl1()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<CompareResponseDTO> getCompareItems(Long userId) {
        Set<String> itemSet = redisService.getCompareItems(userId);
        List<Integer> itemIds = itemSet.stream()
                .map(Long::parseLong)
                .map(Long::intValue)
                .toList();
        List<Cosmetic> items = cosmeticRepository.findAllById(itemIds);
        return items.stream().map(item -> {
            // 키워드 상위 5개 추출
            Map<String, Integer> top5Keywords = null;
            if (item.getCosmeticKeywords() != null) {
                Map<String, Integer> topKeywords = item.getCosmeticKeywords().getTopKeywords();
                log.info("topKeywords: {}", topKeywords);

                top5Keywords = topKeywords.entrySet().stream()
                        .sorted(Map.Entry.<String, Integer>comparingByValue().reversed()) // 빈도순 내림차순
                        .limit(5)
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                Map.Entry::getValue,
                                (a, b) -> a,
                                LinkedHashMap::new // 순서 유지
                        ));
            }

            // 사용자 키워드와의 교집합
            UserKeywords userKeywords = userKeywordsRepository.findById(userId)
                    .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));
            Map<String, Integer> userKeywordMap = userKeywords.getTopKeywords();
            List<String> matched = top5Keywords.keySet().stream()
                    .filter(userKeywordMap::containsKey)
                    .toList();
            
            // 성분 정보 연결 필요

            return new CompareResponseDTO(
                    item.getCosmeticId(),
                    item.getBrand(),
                    item.getName(),
                    item.getImageUrl1(),
                    top5Keywords,
                    matched
            );
        }).toList();
    }
}
