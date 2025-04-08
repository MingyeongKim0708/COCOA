package com.cocoa.backend.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

// 관심 제품 관련 에러코드 정의
@Getter
@AllArgsConstructor
public enum InterestErrorCode implements ErrorCode {

    ALREADY_INTERESTED(HttpStatus.CONFLICT, "INTEREST_409", "이미 관심 등록된 제품입니다."),
    INTEREST_NOT_FOUND(HttpStatus.NOT_FOUND, "INTEREST_404", "관심 목록에 없는 제품입니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
