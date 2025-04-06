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

	// 내부용 키 생성기
	private String getCosmeticLikedByKey(Long cosmeticId) {
		return "cosmetic:" + cosmeticId + ":likedBy";
	}


}
