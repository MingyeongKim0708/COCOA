package com.cocoa.backend.global.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {


	private final RedisTemplate<String, String> redisTemplate;
	private String getInterestKey(long userId) {
		return "user:" + userId + ":interest";
	}
	private String getLatestCosmeticKey(long userId) {
        return "user:" + userId + ":latestCosmetic";
    }
	private String getSearchLogsKey(long userId) {
		return "user:" + userId + ":searchLogs";
	}
	private String getHelpfulKey(long userId) {
		return "user:" + userId + ":helpful";
	}
	private String getRefreshTokenKey(Long userId) {
		return "user:" + userId + ":refreshToken";
	}
	private String getCosmeticLikedByKey(Long cosmeticId) {
		return "cosmetic:" + cosmeticId + ":likedBy";
	}
	private String getCompareKey(long userId) {
		return "user:" + userId + ":compare";
	}

    // 관심 리뷰 추가
    public void addHelpfulReview(long userId, long reviewId) {
        redisTemplate.opsForSet().add(getHelpfulKey(userId), String.valueOf(reviewId));
    }

    // 관심 리뷰 삭제
    public void removeHelpfulReview(long userId, long reviewId) {
        redisTemplate.opsForSet().remove(getHelpfulKey(userId), String.valueOf(reviewId));
    }

    // 관심 리뷰 조회
    public Set<String> getHelpfulReviewIds(long userId) {
        return redisTemplate.opsForSet().members(getHelpfulKey(userId));
    }

    // 관심 여부 확인
    public boolean isHelpfulForMe(long userId, long reviewId) {
        return redisTemplate.opsForSet().isMember(getHelpfulKey(userId), String.valueOf(reviewId));
    }

    // refreshToken 등록
    public void saveRefreshToken(Long userId, String refreshToken, long expireTimeMs) {
        redisTemplate.opsForValue().set(getRefreshTokenKey(userId), refreshToken, expireTimeMs, TimeUnit.MILLISECONDS);
    }

    // refreshToken 조회
    public String getRefreshToken(Long userId) {
        return redisTemplate.opsForValue().get(getRefreshTokenKey(userId));
    }

    // refreshToken 삭제
    public void deleteRefreshToken(Long userId) {
        redisTemplate.delete(getRefreshTokenKey(userId));
    }

    // user:{userId}:interest          ← 유저가 관심 등록한 제품
    // cosmetic:{cosmeticId}:likedBy  ← 제품을 관심 등록한 유저

    // 관심 제품 등록 (양방향 저장)
    public void addInterestProduct(Long userId, Long cosmeticId) {
        redisTemplate.opsForSet().add(getInterestKey(userId), String.valueOf(cosmeticId));
        redisTemplate.opsForSet().add(getCosmeticLikedByKey(cosmeticId), String.valueOf(userId));
    }

    // 관심 제품 해제 (양방향 제거)
    public void removeInterestProduct(Long userId, Long cosmeticId) {
        redisTemplate.opsForSet().remove(getInterestKey(userId), String.valueOf(cosmeticId));
        redisTemplate.opsForSet().remove(getCosmeticLikedByKey(cosmeticId), String.valueOf(userId));
    }

    // 관심 여부 확인
    public boolean isLikedCosmetic(Long userId, Long cosmeticId) {
        return redisTemplate.opsForSet().isMember(getInterestKey(userId), String.valueOf(cosmeticId));
    }

    // 해당 제품의 관심 등록 수 조회
    public long getLikeCountOfCosmetic(Long cosmeticId) {
        return redisTemplate.opsForSet().size(getCosmeticLikedByKey(cosmeticId));
    }

    // 관심 제품 목록 조회
    public Set<String> getInterestedCosmeticIds(Long userId) {
        return redisTemplate.opsForSet().members(getInterestKey(userId));
    }

	// 비교 제품 추가 (최대 2개만 가능, 중복 방지 set 사용)
	public String addCompareItem(long userId, long cosmeticId) {
		String key = getCompareKey(userId);

		// 중복이면 false 반환
		if (Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(key, String.valueOf(cosmeticId)))) {
			return "ALREADY_EXISTS";
		}

		// 2개 이상 담기 방지
		Long size = redisTemplate.opsForSet().size(key);
		if (size != null && size >= 2) {
			return "MAX_LIMIT_REACHED";
		}

		redisTemplate.opsForSet().add(key, String.valueOf(cosmeticId));
		return "SUCCESS";
	}

	// 비교 제품 삭제
	public void removeCompareItem(long userId, long cosmeticId) {
		redisTemplate.opsForSet().remove(getCompareKey(userId), String.valueOf(cosmeticId));
	}

	// 비교 제품 전체 조회
	public Set<String> getCompareItems(long userId) {
		return redisTemplate.opsForSet().members(getCompareKey(userId));
	}

	// 비교 제품 등록 여부 확인
	public boolean isItemInCompare(long userId, long cosmeticId) {
		return redisTemplate.opsForSet().isMember(getCompareKey(userId), String.valueOf(cosmeticId));
	}

    // 최근 검색어 저장(앞에서부터 20개만 유지)
    public void saveSearchLog(Long userId, String keyword) {
        String key = getSearchLogsKey(userId);
        redisTemplate.opsForList().leftPush(key, keyword); // 앞에 추가
        redisTemplate.opsForList().trim(key, 0, 19);
    }

    // 유저의 최근 검색어 가져오기
    public List<String> getSearchLogs(long userId) {
        return redisTemplate.opsForList().range(getSearchLogsKey(userId), 0, -1);
    }

    // 유저의 검색어 로그 삭제 (예: 로그아웃 시)
    public void deleteSearchLogs(long userId) {
        redisTemplate.delete(getSearchLogsKey(userId));
    }

    // 최근 본 상품 이미지 URL 저장(앞에서부터 5개만 유지)
    public void saveLatestCosmeticImage(Long userId, Integer cosmeticId, String imageUrl1) {
        String key = getLatestCosmeticKey(userId);
        String value = cosmeticId + "|" + imageUrl1;
        redisTemplate.opsForList().remove(key, 0, value); // 중복 제거
        redisTemplate.opsForList().leftPush(key, value); // 앞에 추가
        redisTemplate.opsForList().trim(key, 0, 4);
    }

    // 최근 조회한 상품 이미지들 가져오기
    public List<String> getLatestCosmeticImages(long userId) {
        return redisTemplate.opsForList().range(getLatestCosmeticKey(userId), 0, -1);
    }

    // 최근 조회 이미지 초기화 (필요 시)
    public void deleteLatestCosmeticImages(long userId) {
        redisTemplate.delete(getLatestCosmeticKey(userId));
    }

}
