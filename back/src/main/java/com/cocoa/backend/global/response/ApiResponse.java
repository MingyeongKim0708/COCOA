package com.cocoa.backend.global.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
// API 응답을 일관된 형식으로 제공하기 위한 클래스
public class ApiResponse<T> {

    private final boolean success; // 요청 성공 여부
    private final T data; // 응답 데이터(성공시 포함)
    private final String code; // 응답 코드("SUCCESS")
    private final String message; // 응답 메시지

    // 성공 응답
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "SUCCESS", "요청 성공");
    }

    // 실패 응답
    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, null, code, message);
    }
}
