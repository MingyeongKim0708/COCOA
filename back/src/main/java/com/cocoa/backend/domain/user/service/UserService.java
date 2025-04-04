package com.cocoa.backend.domain.user.service;

import com.cocoa.backend.domain.user.dto.reqeust.SignupRequestDTO;
import com.cocoa.backend.domain.user.dto.response.UserResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public interface  UserService {
    void signup(SignupRequestDTO requestDTO, Long userId, String providerId, HttpServletResponse response);
    UserResponseDTO getUserInfo(Long userId);
    void tokenRefresh(HttpServletRequest request, HttpServletResponse response);
    void logout(HttpServletResponse response, Long userId);
}
