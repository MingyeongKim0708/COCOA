package com.cocoa.backend.domain.review.dto.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ReviewUpdateRequestDTO {
	private long reviewId;
	private boolean satisfied;
	private String content;
	private List<String> imageUrls;
	private List<MultipartFile> imageFiles;
}
