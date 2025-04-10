package com.cocoa.backend.domain.review.dto.response;

import java.util.List;

import com.cocoa.backend.domain.review.dto.ReviewDTO;
import com.cocoa.backend.domain.user.dto.response.UserDTO;
import com.cocoa.backend.domain.user.dto.response.UserResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserReviewResponseDTO {
	UserResponseDTO user;
	List<ReviewDTO> reviews;
}
