package com.cocoa.backend.global.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

	private final RedisTemplate<String, String> redisTemplate;
	private String getInterestKey(long userId) {
		return "user:" + userId + ":interest";
	}
	private String getLatestProductKey(long userId) {
		return "user:" + userId + ":latestProduct";
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
}
