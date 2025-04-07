package com.cocoa.backend.global.security;

import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserRepository;
import com.cocoa.backend.global.util.CookieUtil;
import com.cocoa.backend.global.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    private final UserRepository userRepository;

    @Value("${spring.jwt.accesstoken-expires-in}")
    private Long ACCESSTOKEN_EXPIRES_IN;

    @Value("${spring.jwt.refreshtoken-expires-in}")
    private Long REFRESHTOKEN_EXPIRES_IN;

    @Value("${client.url}")
    private String CLIENT_URL;

    public CustomSuccessHandler(JWTUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("handler success method");
        CustomOAuth2UserDTO customUserDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        String providerId = customUserDetails.getProviderId();
        Long userId = customUserDetails.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        String accessToken = jwtUtil.createJwt(user.getUserId(), providerId, ACCESSTOKEN_EXPIRES_IN);
        String refreshToken = jwtUtil.createJwt(userId, providerId, REFRESHTOKEN_EXPIRES_IN);
        response.addCookie(CookieUtil.createCookie("Authorization", accessToken, (int)(ACCESSTOKEN_EXPIRES_IN / 1000)));
        response.addCookie(CookieUtil.createCookie("RefreshToken", refreshToken, (int)(REFRESHTOKEN_EXPIRES_IN / 1000)));

        if (user.getNickname() == null) {
            response.sendRedirect(CLIENT_URL + "/sign-up"); // 회원가입
        } else {
            response.sendRedirect(CLIENT_URL + "/welcome"); // 로그인
        }

        log.info("✅ 발급된 AccessToken: {}", accessToken);
        log.info("✅ 발급된 RefreshToken: {}", refreshToken);

    }
}
