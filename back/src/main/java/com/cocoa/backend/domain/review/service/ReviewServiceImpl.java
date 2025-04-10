package com.cocoa.backend.domain.review.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.cosmetic.repository.CosmeticKeywordRepository;
import com.cocoa.backend.domain.cosmetic.service.CosmeticService;
import com.cocoa.backend.domain.review.dto.ReviewDTO;
import com.cocoa.backend.domain.review.dto.request.ReviewInsertRequestDTO;
import com.cocoa.backend.domain.review.dto.request.ReviewUpdateRequestDTO;
import com.cocoa.backend.domain.review.dto.response.CosmeticReviewResponseDTO;
import com.cocoa.backend.domain.review.dto.response.UserReviewResponseDTO;
import com.cocoa.backend.domain.review.entity.Review;
import com.cocoa.backend.domain.review.mapper.ReviewMapper;
import com.cocoa.backend.domain.review.repository.ReviewRepository;
import com.cocoa.backend.domain.user.dto.response.UserResponseDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserKeywordsRepository;
import com.cocoa.backend.domain.user.service.UserService;
import com.cocoa.backend.global.converter.KeywordJsonConverter;
import com.cocoa.backend.global.exception.CustomException;
import com.cocoa.backend.global.exception.ErrorCode;
import com.cocoa.backend.global.exception.InterestErrorCode;
import com.cocoa.backend.global.redis.RedisService;
import com.cocoa.backend.global.s3.S3Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService{
	private final ReviewRepository reviewRepository;
	private final ReviewMapper reviewMapper;
	private final RedisService redisService;
	private final UserService userService;
	private final ReviewKeywordAnalysisService analysisService;
	private final CosmeticService cosmeticService;
	private final UserKeywordsRepository userKeywordsRepository;
	private final CosmeticKeywordRepository cosmeticKeywordRepository;
	private final S3Service s3Service;
	private final KeywordJsonConverter jsonConverter;

	@Override
	@Transactional
	public boolean insertReview(long userId, ReviewInsertRequestDTO request) {
		List<String> imageUrls = new ArrayList<>();
		if (request.getImageFiles() != null) {
			for (MultipartFile image : request.getImageFiles()) {
				String url = s3Service.upload(image, "review-image");
				imageUrls.add(url);
			}
		}
		// log.info("들어온 정보 유저{} 화장품: {} 내용: {} 만족 :{}",userId, request.getCosmeticId(),request.getContent(),request.getSatisfied());

		User user = userService.getUser(userId);
		Cosmetic cosmetic = cosmeticService.getOneByCosmeticId(request.getCosmeticId());

		Review review = Review.of(null,user,cosmetic,request.getContent(),request.getSatisfied(),new HashMap<>(),0,imageUrls);
		log.info(review.toString());
		try {
			review = reviewRepository.save(review);
		} catch (Exception e) {
			log.error("리뷰 저장 중 오류 발생", e);
			throw new CustomException((ErrorCode)e);
		}

		analysisService.analyzeAsync(review);

		return true;
	}

	@Override
	public ReviewDTO getUpdateReview(long reviewId) {
		log.info("getUpdateReview id {}",reviewId);
		Review review = reviewRepository.findById((int)reviewId).orElseThrow(() -> new CustomException(
			InterestErrorCode.INTEREST_NOT_FOUND));

		return reviewMapper.toDTO(review);
	}

	@Override
	@Transactional
	public boolean updateReview(long userId, ReviewUpdateRequestDTO request) {
		List<String> imageUrls = request.getImageUrls();
		if (request.getImageFiles() != null) {
			for (MultipartFile image : request.getImageFiles()) {
				String url = s3Service.upload(image, "review-images");
				imageUrls.add(url);
			}
		}
		Review review = reviewRepository.getReferenceById((int)request.getReviewId());

		User user = userService.getUser(userId);
		String keywordJson = jsonConverter.convertToDatabaseColumn(review.getKeywords());

		userKeywordsRepository.subtractKeywords(user.getUserId(),keywordJson);
		cosmeticKeywordRepository.subtractKeywords(review.getCosmetic().getCosmeticId(),keywordJson);

		review = Review.of(review.getReviewId(),user,review.getCosmetic(),request.getContent(),
			request.isSatisfied(),review.getKeywords(),review.getHelpfulCount(), imageUrls);

		try {
			review = reviewRepository.save(review);
		} catch (Exception e) {
			log.error("리뷰 저장 중 오류 발생", e);
			throw new CustomException((ErrorCode)e);
		}

		analysisService.analyzeAsync(review);

		return true;
	}

	@Override
	@Transactional
	public boolean increaseHelpfulCount(Long userId, long reviewId) {
		int result = reviewRepository.increaseHelpfulCount(reviewId);
		redisService.addHelpfulReview(userId,reviewId);
		return true;
	}

	@Override
	@Transactional
	public boolean decreaseHelpfulCount(Long userId, long reviewId) {
		int result = reviewRepository.decreaseHelpfulCount(reviewId);
		redisService.removeHelpfulReview(userId,reviewId);
		return true;
	}

	@Override
	@Transactional
	public UserReviewResponseDTO getReviewsByUserId(long userId, boolean isOwner, int page) {
		Pageable pageable = PageRequest.of(page, 10, Sort.by("reviewId").descending());
		Page<Review> reviewList = reviewRepository.findByUser_UserId(userId, pageable);
		Set<String> helpfulReviewIds = redisService.getHelpfulReviewIds(userId);
		List<ReviewDTO> reviewDTOList = new ArrayList<>();

		boolean helpfulForMe = false;
		for(Review review: reviewList){
			helpfulForMe = helpfulReviewIds.contains(review.getReviewId().toString());
			reviewDTOList.add(reviewMapper.toDTO(review,helpfulForMe));
		}

		UserReviewResponseDTO responseDTO;

		if(page == 0 && !isOwner) {
			UserResponseDTO userDto = userService.getUserInfo(userId);
			responseDTO = new UserReviewResponseDTO(userDto,reviewDTOList);
		}else
			responseDTO = new UserReviewResponseDTO(null, reviewDTOList);
		return responseDTO;
	}

	@Override
	@Transactional
	public CosmeticReviewResponseDTO getReviewsByCosmeticId(long userId, int cosmeticId, String keyword,int page) {
		Pageable pageable = PageRequest.of(page, 10, Sort.by(Sort.Order.desc("helpfulCount"), Sort.Order.desc("reviewId")));
		Page<Review> reviewList = reviewRepository.findByCosmetic_CosmeticId(cosmeticId, pageable);
		Set<String> helpfulReviewIds = redisService.getHelpfulReviewIds(userId);
		List<ReviewDTO> reviewDTOList = reviewList.stream()
			.filter(review -> keyword == null || review.getKeywords().containsKey(keyword))
			.map(review -> {
				boolean helpfulForMe = helpfulReviewIds.contains(review.getReviewId().toString());
				return reviewMapper.toDTO(review, helpfulForMe);
			})
			.toList();

		if(page==0)
			return new CosmeticReviewResponseDTO(getReviewAmount(cosmeticId),reviewDTOList);
		else return new CosmeticReviewResponseDTO(0,reviewDTOList);
	}

	@Override
	@Transactional
	public int getReviewAmount(int cosmeticId) {
		return reviewRepository.countByCosmetic_CosmeticId(cosmeticId);
	}

}
