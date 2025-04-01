package com.cocoa.backend.global.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@Order(1)
public class OAuth2CallbackLoggingFilter extends OncePerRequestFilter {
    // 인가코드 확인용 필터
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (request.getRequestURI().equals("/login/oauth2/code/kakao")) {
            String code = request.getParameter("code");
            String state = request.getParameter("state");
            log.info("OAuth2 Callback - code: {}, state: {}", code, state);
        }
        filterChain.doFilter(request, response);
    }
}
