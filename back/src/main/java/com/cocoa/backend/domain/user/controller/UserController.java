package com.cocoa.backend.domain.user.controller;

import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.domain.user.dto.reqeust.SignupRequestDTO;
import com.cocoa.backend.domain.user.dto.response.UserTestResponseDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserRepository;
import com.cocoa.backend.global.util.JWTUtil;
import jakarta.servlet.http.Cookie;
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
@RestController
public class UserController {
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;

    @Value("${spring.jwt.accesstoken-expires-in}")
    private Long ACCESSTOKEN_EXPIRES_IN;

    public UserController(UserRepository userRepository, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequestDTO requestDTO, Authentication authentication, HttpServletResponse response) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();

        log.info("/signup api 요청");

        User user = userRepository.findByProviderIdAndNicknameIsNull(userDetails.getProviderId())
                .orElseThrow(() -> new RuntimeException("이미 등록된 사용자거나 잘못된 요청입니다."));

        // 사용자 정보 업데이트
        user.setNickname(requestDTO.getNickname());
        user.setBirthDate(requestDTO.getBirthDate());
        user.setGender(requestDTO.getGender());
        user.setSkinType(requestDTO.getSkinType());
        user.setSkinTone(requestDTO.getSkinTone());
        userRepository.save(user);

        // JWT 생성 및 응답
        String token = jwtUtil.createJwt(user.getUserId(), user.getProviderId(), ACCESSTOKEN_EXPIRES_IN);

        // 쿠키로 accessToken 전달
        Cookie cookie = new Cookie("Authorization", token);
        cookie.setAttribute("SameSite", "None");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (ACCESSTOKEN_EXPIRES_IN / 1000));
        cookie.setSecure(true); // 배포 시 활성화 (HTTPS만 허용)
        response.addCookie(cookie);

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    // 테스트
    @GetMapping("/users")
    public ResponseEntity<?> getUser(Authentication authentication) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        log.info("user nickname : {}", user.getNickname());

        Map<String, Integer> topKeywords = null;

        if (user.getUserKeywords() != null) {
            topKeywords = user.getUserKeywords().getTopKeywords();
            log.info("topKeyWord: {}", topKeywords);
        }

        UserTestResponseDTO responseDTO = new UserTestResponseDTO(
                user.getNickname(),
                user.getBirthDate(),
                user.getGender(),
                user.getSkinType(),
                user.getSkinTone(),
                topKeywords
        );
        log.info("responseDTO: {}", responseDTO);
        return ResponseEntity.ok(responseDTO);
    }
}
