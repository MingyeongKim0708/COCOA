package com.cocoa.backend.domain.user.service;

import com.cocoa.backend.domain.user.dto.reqeust.SignupRequestDTO;
import com.cocoa.backend.domain.user.dto.response.UserTestResponseDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserRepository;
import com.cocoa.backend.global.redis.RedisService;
import com.cocoa.backend.global.util.CookieUtil;
import com.cocoa.backend.global.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;
    private final RedisService redisService;

    @Value("${spring.jwt.accesstoken-expires-in}")
    private Long ACCESSTOKEN_EXPIRES_IN;

    @Value("${spring.jwt.refreshtoken-expires-in}")
    private Long REFRESHTOKEN_EXPIRES_IN;

    public UserServiceImpl(UserRepository userRepository, JWTUtil jwtUtil, RedisService redisService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.redisService = redisService;
    }

    @Override
    public void signup(SignupRequestDTO requestDTO, Long userId, String providerId, HttpServletResponse response) {
        User user = userRepository.findByProviderIdAndNicknameIsNull(providerId)
                .orElseThrow(() -> new RuntimeException("이미 등록된 사용자거나 잘못된 요청입니다."));

        user.setNickname(requestDTO.getNickname());
        user.setBirthDate(requestDTO.getBirthDate());
        user.setGender(requestDTO.getGender());
        user.setSkinType(requestDTO.getSkinType());
        user.setSkinTone(requestDTO.getSkinTone());

        userRepository.save(user);

        // JWT 발급
        String accessToken = jwtUtil.createJwt(userId, providerId, ACCESSTOKEN_EXPIRES_IN);
        String refreshToken = jwtUtil.createJwt(userId, providerId, REFRESHTOKEN_EXPIRES_IN);

        // Redis 저장
        redisService.saveRefreshToken(userId, refreshToken, REFRESHTOKEN_EXPIRES_IN);

        // 쿠키 전송
        response.addCookie(CookieUtil.createCookie("Authorization", accessToken, (int)(ACCESSTOKEN_EXPIRES_IN / 1000)));
        response.addCookie(CookieUtil.createCookie("RefreshToken", refreshToken, (int)(REFRESHTOKEN_EXPIRES_IN / 1000)));
    }

    @Override
    public UserTestResponseDTO getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        log.info("user nickname : {}", user.getNickname());

        Map<String, Integer> topKeywords = null;
        if (user.getUserKeywords() != null) {
            topKeywords = user.getUserKeywords().getTopKeywords();
            log.info("topKeyWord: {}", topKeywords);
        }

        return new UserTestResponseDTO(
                user.getNickname(),
                user.getBirthDate(),
                user.getGender(),
                user.getSkinType(),
                user.getSkinTone(),
                topKeywords
        );
    }
}
