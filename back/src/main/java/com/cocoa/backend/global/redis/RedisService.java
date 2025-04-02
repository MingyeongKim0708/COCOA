package com.cocoa.backend.global.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

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
}
