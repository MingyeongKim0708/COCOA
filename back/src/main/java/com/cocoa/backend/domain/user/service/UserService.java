package com.cocoa.backend.domain.user.service;

import com.cocoa.backend.domain.user.dto.reqeust.SignupRequestDTO;
import com.cocoa.backend.domain.user.dto.response.UserTestResponseDTO;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public interface  UserService {
    void signup(SignupRequestDTO requestDTO, Long userId, String providerId, HttpServletResponse response);
    UserTestResponseDTO getUserInfo(Long userId);
}
