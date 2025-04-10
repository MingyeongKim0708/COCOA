package com.cocoa.backend.domain.review.service;

import java.util.Map;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.cocoa.backend.domain.review.dto.request.ReviewKeywordResponseDTO;
import com.cocoa.backend.domain.review.entity.Review;
import com.cocoa.backend.domain.review.repository.ReviewRepository;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticKeywordRepository;
import com.cocoa.backend.domain.user.repository.UserKeywordsRepository;
import com.cocoa.backend.global.converter.KeywordJsonConverter;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewKeywordAnalysisService {

	private final ReviewRepository reviewRepository;
	private final UserKeywordsRepository userKeywordsRepository;
	private final CosmeticKeywordRepository cosmeticKeywordRepository;
	private final RestTemplate restTemplate;
	private final KeywordJsonConverter jsonConverter;

	@Async
	@Transactional
	public void analyzeAsync(Review review) {
		Map<String, Object> body = Map.of(
			"review_id", review.getReviewId(),
			"review", review.getContent()
		);
		log.info("analyzeAsync get started!!! {}", review.getUser().getUserId());
		try {
			ReviewKeywordResponseDTO response = restTemplate.postForObject(
				"http://j12a507a.p.ssafy.io:5000/analyze/review",
				body,
				ReviewKeywordResponseDTO.class
			);

			if (response == null)
				log.info("키워드 분석 실패!@ㄸㅉㅇㅃ");
			else
				log.info("review_id {} review{}", response.getKeywords().entrySet().stream().toList(),
					response.getReviewId());

			if(response==null) throw new Exception();

			reviewRepository.updateKeywords(response.getReviewId(), response.getKeywords());
			cosmeticKeywordRepository.updateKeywords(review.getCosmetic().getCosmeticId(), response.getKeywords());
			userKeywordsRepository.updateKeywords(review.getUser().getUserId(), response.getKeywords());
		} catch (Exception e) {
			log.error("분석 실패: {}", e.getMessage());
		}
	}
}
