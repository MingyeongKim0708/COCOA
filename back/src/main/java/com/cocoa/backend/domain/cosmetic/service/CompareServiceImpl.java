package com.cocoa.backend.domain.cosmetic.service;

import com.cocoa.backend.domain.cosmetic.dto.response.CompareKeywordDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CompareModalResponseDTO;
import com.cocoa.backend.domain.cosmetic.dto.response.CompareResponseDTO;
import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.cosmetic.entity.CosmeticIngredientText;
import com.cocoa.backend.domain.cosmetic.errorcode.CompareErrorCode;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticIngredientTextRepository;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticRepository;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.entity.UserKeywords;
import com.cocoa.backend.domain.user.errorcode.UserErrorCode;
import com.cocoa.backend.domain.user.repository.UserKeywordsRepository;
import com.cocoa.backend.domain.user.repository.UserRepository;
import com.cocoa.backend.global.exception.CustomException;
import com.cocoa.backend.global.redis.RedisService;
import com.cocoa.backend.global.util.UserUtil;
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
    private final UserRepository userRepository;
    private final CosmeticIngredientTextRepository cosmeticIngredientTextRepository;

    public CompareServiceImpl(RedisService redisService, CosmeticRepository cosmeticRepository, UserKeywordsRepository userKeywordsRepository, UserRepository userRepository, CosmeticIngredientTextRepository cosmeticIngredientTextRepository) {
        this.redisService = redisService;
        this.cosmeticRepository = cosmeticRepository;
        this.userKeywordsRepository = userKeywordsRepository;
        this.userRepository = userRepository;
        this.cosmeticIngredientTextRepository = cosmeticIngredientTextRepository;
    }

    @Override
    public List<Integer> getCompareItemIds(Long userId) {
        return redisService.getCompareItems(userId).stream()
                .map(Long::parseLong)
                .map(Long::intValue)
                .toList();
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
        log.info("레디스에 등록된 itemIds : {}", itemIds);

        // 사용자 키워드와의 교집합
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));
        Set<String> userKeywordSet = new HashSet<>();
        userKeywordSet.add(String.valueOf(user.getGender()));
        userKeywordSet.add(String.valueOf(user.getSkinType()));
        userKeywordSet.add(String.valueOf(user.getSkinTone()));
        String ageGroup = UserUtil.calculateAgeGroup(user.getBirthDate());
        userKeywordSet.add(ageGroup);

        UserKeywords userKeywords = userKeywordsRepository.findById(userId).orElse(null);
        if (userKeywords != null && userKeywords.getTopKeywords() != null) {
            userKeywordSet.addAll(userKeywords.getTopKeywords().keySet());
        }

        return items.stream().map(item -> {
            // 키워드 상위 5개 추출
            List<CompareKeywordDTO> top5Keywords = new ArrayList<>();
            Set<String> matchedKeywords = new HashSet<>();
            if (item.getCosmeticKeywords() != null) {
                Map<String, Integer> topKeywords = item.getCosmeticKeywords().getTopKeywords();
                log.info("topKeywords: {}", topKeywords);

                topKeywords.entrySet().stream()
                        .sorted(Map.Entry.<String, Integer>comparingByValue().reversed()) // 빈도순 내림차순
                        .limit(5)
                        .forEach(entry -> {
                            String keyword = entry.getKey();
                            Integer count = entry.getValue();
                            boolean matched = userKeywordSet.contains(keyword);
                            if (matched) matchedKeywords.add(keyword);
                            top5Keywords.add(new CompareKeywordDTO(keyword, count, matched));
                        });
            }

            // 성분 정보
            String text = null;
            CosmeticIngredientText cosInText = cosmeticIngredientTextRepository.findById(item.getCosmeticId()).orElse(null);
            if (cosInText != null) {
                Map<String, String> ingredientMap = cosInText.getIngredientText();
                if (ingredientMap != null && !ingredientMap.isEmpty()) {
                    text = ingredientMap.values().iterator().next(); // 첫 번째 value만 추출
                }
            }

            return new CompareResponseDTO(
                    item.getCosmeticId(),
                    item.getBrand(),
                    item.getName(),
                    item.getImageUrl1(),
                    top5Keywords,
                    matchedKeywords,
                    text
            );
        }).toList();
    }

    @Override
    public void removeAllCompareItems(Long userId) {
        redisService.removeAllCompareItems(userId);
    }
}
