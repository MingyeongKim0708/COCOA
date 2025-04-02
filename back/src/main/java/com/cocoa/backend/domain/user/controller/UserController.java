package com.cocoa.backend.domain.user.controller;

import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.domain.user.dto.reqeust.SignupRequestDTO;
import com.cocoa.backend.domain.user.dto.response.UserTestResponseDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserRepository;
import com.cocoa.backend.domain.user.service.UserService;
import com.cocoa.backend.global.response.ApiResponse;
import com.cocoa.backend.global.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RequestMapping("/user")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@RequestBody SignupRequestDTO requestDTO, Authentication authentication, HttpServletResponse response) {
        log.info("/signup api 요청");
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        userService.signup(requestDTO, userDetails.getUserId(), userDetails.getProviderId(), response);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null));
    }

    @PostMapping("/token-refresh")
    public ResponseEntity<ApiResponse<Void>> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        userService.tokenRefresh(request, response);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null));
    }

    // 테스트
    @GetMapping
    public ResponseEntity<ApiResponse<UserTestResponseDTO>> getUser(Authentication authentication) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        UserTestResponseDTO userInfo = userService.getUserInfo(userDetails.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(userInfo));
    }
}
