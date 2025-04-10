package com.cocoa.backend.domain.review.dto.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewInsertRequestDTO {
	private int cosmeticId;
	private String content;
	private Boolean satisfied;
	private List<MultipartFile> imageFiles;
}
