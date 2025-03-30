package com.cocoa.backend.domain.user.controller;

import com.cocoa.backend.domain.user.dto.SignupRequestDTO;
import com.cocoa.backend.domain.user.dto.SignupResponseDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/signup")
    public ResponseEntity<Void> kakaoSignup(SignupRequestDTO signupRequestDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

}
