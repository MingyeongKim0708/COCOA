package com.cocoa.backend.domain.review.entity;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.cocoa.backend.domain.cosmetic.entity.Cosmetic;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.global.converter.KeywordJsonConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "review_id")
	private Long reviewId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cosmetic_id")
	private Cosmetic cosmetic;

	@Column(name = "content", columnDefinition = "TEXT")
	private String content;

	@Column(name = "satisfied")
	private Boolean satisfied;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(columnDefinition = "jsonb")
	private Map<String, Integer> keywords;

	@Column(name = "image_url1")
	private String imageUrl1;

	@Column(name = "image_url2")
	private String imageUrl2;

	@Column(name = "image_url3")
	private String imageUrl3;

	@Column(name = "image_url4")
	private String imageUrl4;

	@Column(name = "image_url5")
	private String imageUrl5;

	@Column(name = "helpful_count")
	private int helpfulCount;

	@Column(name = "created_at")
	private LocalDate createdAt;

	public static Review of(Long reviewId, User user, Cosmetic cosmetic, String content, Boolean satisfied,Map<String,Integer> keywords,int helpfulCount,List<String> imageUrls) {
		return new Review(
			reviewId,
			user,
			cosmetic,
			content,
			satisfied,
			keywords,
			!imageUrls.isEmpty() ? imageUrls.get(0) : null,
			imageUrls.size() > 1 ? imageUrls.get(1) : null,
			imageUrls.size() > 2 ? imageUrls.get(2) : null,
			imageUrls.size() > 3 ? imageUrls.get(3) : null,
			imageUrls.size() > 4 ? imageUrls.get(4) : null,
			helpfulCount,
			LocalDate.now()
		);
	}

	@Override
	public String toString() {
		return "Review{" +
			"reviewId=" + reviewId +
			", user=" + user.getUserId() +
			", cosmetic=" + cosmetic.getCosmeticId() +
			", content='" + content + '\'' +
			", satisfied=" + satisfied +
			", keywords=" + keywords +
			", imageUrl1='" + imageUrl1 + '\'' +
			", imageUrl2='" + imageUrl2 + '\'' +
			", imageUrl3='" + imageUrl3 + '\'' +
			", imageUrl4='" + imageUrl4 + '\'' +
			", imageUrl5='" + imageUrl5 + '\'' +
			", helpfulCount=" + helpfulCount +
			", createdAt=" + createdAt +
			'}';
	}
}
