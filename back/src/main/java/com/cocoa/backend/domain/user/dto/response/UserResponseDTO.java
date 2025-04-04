package com.cocoa.backend.domain.user.dto.response;

import com.cocoa.backend.domain.user.entity.Gender;
import com.cocoa.backend.domain.user.entity.SkinTone;
import com.cocoa.backend.domain.user.entity.SkinType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String nickname;
    private String imageUrl;
    private String ageGroup;
    private Gender gender;
    private SkinType skinType;
    private SkinTone skinTone;
    private Map<String, Integer> topKeywords;
}
