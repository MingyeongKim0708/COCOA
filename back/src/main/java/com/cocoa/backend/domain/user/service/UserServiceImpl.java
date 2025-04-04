package com.cocoa.backend.domain.user.service;

import com.cocoa.backend.domain.user.dto.reqeust.SignupRequestDTO;
import com.cocoa.backend.domain.user.dto.response.UserResponseDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.errorcode.TokenErrorCode;
import com.cocoa.backend.domain.user.repository.UserRepository;
import com.cocoa.backend.global.exception.CustomException;
import com.cocoa.backend.global.redis.RedisService;
import com.cocoa.backend.global.util.CookieUtil;
import com.cocoa.backend.global.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
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
    public void tokenRefresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;

        // 1. 쿠키에서 RefreshToken 추출
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("RefreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            throw new CustomException(TokenErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        // 2. 만료 여부 확인
        if (jwtUtil.isExpired(refreshToken)) {
            throw new CustomException(TokenErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        // 3. 사용자 정보 추출
        Long userId = jwtUtil.getUserId(refreshToken);
        String providerId = jwtUtil.getProviderId(refreshToken);

        // 4. Redis에서 저장된 RefreshToken과 비교
        String storedToken = redisService.getRefreshToken(userId);
        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new CustomException(TokenErrorCode.REFRESH_TOKEN_MISMATCH);
        }

        // 5. AccessToken 재발급
        String newAccessToken = jwtUtil.createJwt(userId, providerId, ACCESSTOKEN_EXPIRES_IN);

        // 6. 쿠키로 전송
        Cookie newAccessCookie = CookieUtil.createCookie("Authorization", newAccessToken, (int)(ACCESSTOKEN_EXPIRES_IN / 1000));
        response.addCookie(newAccessCookie);
    }

    @Override
    public UserResponseDTO getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        log.info("user nickname : {}", user.getNickname());

        String ageGroup = calculateAgeGroup(user.getBirthDate());

        Map<String, Integer> topKeywords = null;
        if (user.getUserKeywords() != null) {
            topKeywords = user.getUserKeywords().getTopKeywords();
            log.info("topKeyWord: {}", topKeywords);
        }

        return new UserResponseDTO(
                user.getUserId(),
                user.getNickname(),
                user.getImageUrl(),
                ageGroup,
                user.getGender(),
                user.getSkinType(),
                user.getSkinTone(),
                topKeywords
        );
    }

    private String calculateAgeGroup(LocalDate birthDate) {
        int age = Period.between(birthDate, LocalDate.now()).getYears();

        if (age < 20) return "10대";
        if (age < 30) return "20대";
        if (age < 40) return "30대";
        if (age < 50) return "40대";
        if (age < 60) return "50대";
        return "60대 이상";
    }
}
