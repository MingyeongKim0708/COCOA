package com.cocoa.backend.domain.user.repository;

import com.cocoa.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByProviderId(String providerId);
    Optional<User> findByProviderIdAndNicknameIsNull(String providerId);
}
