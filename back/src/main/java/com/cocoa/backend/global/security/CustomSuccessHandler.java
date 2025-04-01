package com.cocoa.backend.global.security;

import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserRepository;
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

        String token = jwtUtil.createJwt(user.getUserId(), providerId, ACCESSTOKEN_EXPIRES_IN);
        response.addCookie(createCookie("Authorization", token));
        log.info("created jwt accesstoken : {}", token);

        if (user.getNickname() == null) {
            response.sendRedirect(CLIENT_URL + "/sign-up"); // 회원가입
        } else {
            response.sendRedirect(CLIENT_URL + "/main"); // 로그인
        }
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setAttribute("SameSite", "None");
        cookie.setMaxAge(60*60*60);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
