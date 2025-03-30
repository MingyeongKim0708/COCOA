package com.cocoa.backend.global.security;

import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
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

    @Value("${spring.jwt.accesstoken-expires-in}")
    private Long ACCESSTOKEN_EXPIRES_IN;

    @Value("${client.url}")
    private String CLIENT_URL;

    public CustomSuccessHandler(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("handler success method");
        CustomOAuth2UserDTO customUserDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();
        String providerId = customUserDetails.getProviderId();
        String token = jwtUtil.createJwt(providerId, ACCESSTOKEN_EXPIRES_IN);

        response.addCookie(createCookie("Authorization", token));
        log.info("created jwt accesstoken : {}", token);
        response.sendRedirect(CLIENT_URL);
//         Postman 테스트용: 토큰을 응답 바디에 직접 포함
//        response.setContentType("application/json");
//        response.setCharacterEncoding("utf-8");
//        response.getWriter().write("{\"token\": \"" + token + "\"}");
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60*60*60);
//        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
