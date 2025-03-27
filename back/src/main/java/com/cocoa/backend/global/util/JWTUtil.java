package com.cocoa.backend.global.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {

    private final SecretKey SECRET_KEY;

    // 생성자 : 내부에서 SECRET_KEY 초기화 + utf8로 인코딩 변경, hs256 방식으로 암호화 진행
    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        SECRET_KEY = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    // 토큰 검증
    public Claims validToken (String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    // - 회원번호 확인
    public String getProviderId(String token) {
        return validToken(token).get("providerId", String.class);
    }
    // - 만료일 확인
    public Boolean isExpired(String token) {
        return validToken(token).getExpiration().before(new Date());
    }

    // 토큰 생성
    public String createJwt(String providerId, Long expiredMs) {
        return Jwts.builder()
                .claim("providerId", providerId)
                .issuedAt(new Date(System.currentTimeMillis())) // 생성시간
                .expiration(new Date(System.currentTimeMillis() + expiredMs)) // 만료시간
                .signWith(SECRET_KEY)
                .compact();
    }
}
