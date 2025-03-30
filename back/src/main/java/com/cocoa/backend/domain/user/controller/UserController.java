package com.cocoa.backend.domain.user.controller;

import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.domain.user.dto.SignupRequestDTO;
import com.cocoa.backend.domain.user.dto.SignupResponseDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserRepository;
import com.cocoa.backend.global.util.JWTUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> signup(@RequestBody SignupRequestDTO requestDTO, Authentication authentication) {
        CustomOAuth2UserDTO userDetails = (CustomOAuth2UserDTO) authentication.getPrincipal();

        User user = userRepository.findByProviderIdAndNicknameIsNull(userDetails.getProviderId())
                .orElseThrow(() -> new RuntimeException("이미 등록된 사용자거나 잘못된 요청입니다."));

        // 사용자 정보 업데이트
        user.setNickname(requestDTO.getNickname());
        user.setBirthYear(requestDTO.getBirthYear());
        user.setBirthMonth(requestDTO.getBirthMonth());
        user.setBirthDay(requestDTO.getBirthDay());
        user.setGender(requestDTO.getGender());
        user.setSkinType(requestDTO.getSkinType());
        user.setSkinTone(requestDTO.getSkinTone());
//        user.setStatus("ROLE_REGISTERED");
        userRepository.save(user);

        // JWT 생성 및 응답
        String token = jwtUtil.createJwt(user.getProviderId(), false, ACCESSTOKEN_EXPIRES_IN);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
