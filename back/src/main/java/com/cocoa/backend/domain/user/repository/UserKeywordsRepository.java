package com.cocoa.backend.domain.user.repository;

import com.cocoa.backend.domain.user.entity.User;
import com.cocoa.backend.domain.user.entity.UserKeywords;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserKeywordsRepository extends JpaRepository<UserKeywords, Long> {
}
