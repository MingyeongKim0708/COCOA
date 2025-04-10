package com.cocoa.backend.domain.review.controller;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cocoa.backend.domain.review.dto.ReviewDTO;
import com.cocoa.backend.domain.review.dto.request.ReviewInsertRequestDTO;
import com.cocoa.backend.domain.review.dto.request.ReviewUpdateRequestDTO;
import com.cocoa.backend.domain.review.dto.response.UserReviewResponseDTO;
import com.cocoa.backend.domain.review.service.ReviewService;
import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/reviews")
public class ReviewController {
	private static final Logger log = LoggerFactory.getLogger(ReviewController.class);
	private final ReviewService reviewService;

	@PostMapping("/write")
	public ResponseEntity<Map<String, String>> insertReview(Authentication authentication,
		@RequestParam int cosmeticId,
		@RequestParam Boolean satisfied,
		@RequestParam String content,
		@RequestPart(required = false) List<MultipartFile> imageFiles) {

		ReviewInsertRequestDTO request = new ReviewInsertRequestDTO(cosmeticId,content,satisfied,imageFiles);
		CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO)authentication.getPrincipal();

		reviewService.insertReview(userDetails.getUserId(), request);
		Map<String, String> response = new HashMap<>();
		response.put("message", "리뷰 등록 성공");

		return ResponseEntity.ok(response);
	}

	@GetMapping("/edit")
	public ResponseEntity<ReviewDTO> getUpdateReview(Authentication authentication, @RequestParam long reviewId) {
		CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO)authentication.getPrincipal();

		ReviewDTO dto = reviewService.getUpdateReview(reviewId);

		return ResponseEntity.ok(dto);
	}

	@PostMapping("/edit")
	public ResponseEntity<Map<String, String>> updateReview(Authentication authentication,
		@RequestParam int reviewId,
		@RequestParam Boolean satisfied,
		@RequestParam String content,
		@RequestParam(required = false) List<String> imageUrls,
		@RequestPart(required = false) List<MultipartFile> imageFiles) {
		CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO)authentication.getPrincipal();
		ReviewUpdateRequestDTO request = new ReviewUpdateRequestDTO (reviewId,satisfied,content,imageUrls,imageFiles);
		reviewService.updateReview(userDetails.getUserId(), request);
		Map<String, String> response = new HashMap<>();
		response.put("message", "리뷰 수정 성공");

		return ResponseEntity.ok(response);
	}

	@PostMapping("/helpful/{reviewId}")
	public ResponseEntity<Map<String, String>> insertHelpfulReview (Authentication authentication, @PathVariable long reviewId){
		CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
		reviewService.increaseHelpfulCount(userDetails.getUserId(),reviewId);
		Map<String, String> response = new HashMap<>();
		response.put("message", "도움이 되었습니다");

		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/helpful/{reviewId}")
	public ResponseEntity<Map<String, String>> deleteHelpfulReview (Authentication authentication, @PathVariable long reviewId){
		CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
		reviewService.decreaseHelpfulCount(userDetails.getUserId(),reviewId);
		Map<String, String> response = new HashMap<>();
		response.put("message", "도움이 되지 않았습니다");

		return ResponseEntity.ok(response);
	}

	@GetMapping("/users/{userId}")
	public ResponseEntity<UserReviewResponseDTO> getReviewsByUserId(Authentication authentication,
		@PathVariable long userId, @RequestParam int page) {
		CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO)authentication.getPrincipal();
		boolean isOwner = userDetails.getUserId() == userId;

		UserReviewResponseDTO response = reviewService.getReviewsByUserId(userId, isOwner, 0);

		if (page == 0) {
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.ok(response);
		}
	}

	@GetMapping("/cosmetics/{cosmeticId}")
	public ResponseEntity<List<ReviewDTO>> getReviewsByCosmeticId(Authentication authentication,
		@PathVariable int cosmeticId, @RequestParam int page) {
		CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO)authentication.getPrincipal();
		List<ReviewDTO> reviewList = reviewService.getReviewsByCosmeticId(userDetails.getUserId(), cosmeticId, 0);

		return ResponseEntity.ok(reviewList);
	}
}