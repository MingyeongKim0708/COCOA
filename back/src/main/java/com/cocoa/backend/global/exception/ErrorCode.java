package com.cocoa.backend.global.exception;

import org.springframework.http.HttpStatus;

public interface ErrorCode {
    HttpStatus getStatus();   // 예: 404, 500
    String getCode();         // 예: "NOT_FOUND", "INTERNAL_SERVER_ERROR"
    String getMessage();      // 예: "카테고리를 찾을 수 없습니다."
}