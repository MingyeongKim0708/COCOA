package com.cocoa.backend.domain.cosmetic.errorcode;

import com.cocoa.backend.global.exception.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum CompareErrorCode implements ErrorCode {
    ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 비교함에 담긴 항목"),
    MAX_LIMIT_EXCEEDED(HttpStatus.BAD_REQUEST, "비교함 제품 2개 초과");

    private final HttpStatus status;
    private final String message;

    CompareErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    @Override
    public String getCode() {
        return name();
    }
}
