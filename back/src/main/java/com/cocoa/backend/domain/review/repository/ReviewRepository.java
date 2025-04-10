package com.cocoa.backend.domain.review.repository;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cocoa.backend.domain.review.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

	Page<Review> findByCosmetic_CosmeticId(int cosmeticId, Pageable pageable);

	Page<Review> findByUser_UserId(long userId, Pageable pageable);

	@Modifying
	@Query("UPDATE Review r SET r.helpfulCount = r.helpfulCount + 1 WHERE r.reviewId = :reviewId")
	int increaseHelpfulCount(@Param("reviewId") Long reviewId);

	@Modifying
	@Query("UPDATE Review r SET r.helpfulCount = r.helpfulCount - 1 WHERE r.reviewId = :reviewId AND r.helpfulCount > 0")
	int decreaseHelpfulCount(@Param("reviewId") Long reviewId);

	@Modifying
	@Query(value = "UPDATE reviews SET keywords = CAST(:keywords AS jsonb) WHERE review_id = :reviewId", nativeQuery = true)
	void updateKeywords(@Param("reviewId") int reviewId, @Param("keywords") Map<String,Integer> keywords);

	int countByCosmetic_CosmeticId(int cosmeticId);
}
