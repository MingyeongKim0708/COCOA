package com.cocoa.backend.domain.user.errorcode;

import com.cocoa.backend.global.exception.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum TokenErrorCode implements ErrorCode {
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "RefreshToken 없음"),
    REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "RefreshToken 만료"),
    REFRESH_TOKEN_MISMATCH(HttpStatus.UNAUTHORIZED, "RefreshToken 불일치");

    private final HttpStatus status;
    private final String message;

    TokenErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    @Override
    public String getCode() {
        return name();
    }
}
