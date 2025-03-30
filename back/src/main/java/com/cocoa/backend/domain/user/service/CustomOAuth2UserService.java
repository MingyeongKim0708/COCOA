package com.cocoa.backend.domain.user.service;

import com.cocoa.backend.domain.user.dto.CustomOAuth2UserDTO;
import com.cocoa.backend.domain.user.dto.KakaoResponse;
import com.cocoa.backend.domain.user.dto.OAuth2Response;
import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("loadUser: {}", oAuth2User);

        // 어느 소셜 서비스에서 온 값인지 확인하기 위한 registrationId
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("registrationId: {}", registrationId);

        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("kakao")) {
            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
        }
        else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
//            return null;
        }

        // 리소스 서버에서 발급 받은 정보로 사용자를 특정할 아이디값을 만듦
        String providerId = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();
        log.info("providerId: {}", providerId);
        User user = userRepository.findByProviderId(providerId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setProviderId(providerId);
                    return userRepository.save(newUser);
                });
        log.info("service log1");

        CustomOAuth2UserDTO customOAuth2UserDTO = new CustomOAuth2UserDTO();
        customOAuth2UserDTO.setProviderId(providerId);
        log.info("service log2");

        return customOAuth2UserDTO;
    }
}
