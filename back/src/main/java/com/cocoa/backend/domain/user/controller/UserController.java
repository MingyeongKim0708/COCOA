package com.cocoa.backend.domain.user.controller;

import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.domain.user.dto.reqeust.SignupRequestDTO;
import com.cocoa.backend.domain.user.dto.response.UserTestResponseDTO;
import com.cocoa.backend.domain.user.errorcode.TokenErrorCode;
import com.cocoa.backend.domain.user.errorcode.UserErrorCode;
import com.cocoa.backend.domain.user.service.UserService;
import com.cocoa.backend.global.exception.CustomException;
import com.cocoa.backend.global.redis.RedisService;
import com.cocoa.backend.global.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping("/user")
@RestController
public class UserController {
    private final UserService userService;
    private final RedisService redisService;

    public UserController(UserService userService, RedisService redisService) {
        this.userService = userService;
        this.redisService = redisService;
    }

    // 추가 정보 입력 (회원가입)
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@RequestBody SignupRequestDTO requestDTO, Authentication authentication, HttpServletResponse response) {
        log.info("/signup api 요청");
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        userService.signup(requestDTO, userDetails.getUserId(), userDetails.getProviderId(), response);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null));
    }

    // access token 재발급
    @PostMapping("/token-refresh")
    public ResponseEntity<ApiResponse<Void>> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        userService.tokenRefresh(request, response);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null));
    }

    // 테스트 : 3000/main에서 user 정보 가져오는지 테스트 (로그인 안하면 root로 이동)
    @GetMapping
    public ResponseEntity<ApiResponse<UserTestResponseDTO>> getUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException(UserErrorCode.LOGIN_NEEDED);
        }

        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        UserTestResponseDTO userInfo = userService.getUserInfo(userDetails.getUserId());
        log.info("userInfo: {}", userInfo);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(userInfo));
    }
}
