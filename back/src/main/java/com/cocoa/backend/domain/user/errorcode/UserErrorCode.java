package com.cocoa.backend.domain.user.errorcode;

import com.cocoa.backend.global.exception.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum UserErrorCode implements ErrorCode {
    LOGIN_NEEDED(HttpStatus.UNAUTHORIZED, "로그인 필요");

    private final HttpStatus status;
    private final String message;

    UserErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    @Override
    public String getCode() {
        return name();
    }
}
