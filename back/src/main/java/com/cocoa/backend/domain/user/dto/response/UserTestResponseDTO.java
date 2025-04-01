package com.cocoa.backend.domain.user.dto.response;

import com.cocoa.backend.domain.user.entity.Gender;
import com.cocoa.backend.domain.user.entity.SkinTone;
import com.cocoa.backend.domain.user.entity.SkinType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Map;

@Data
@AllArgsConstructor
public class UserTestResponseDTO {
    private String nickname;
    private LocalDate birthDate;
    private Gender gender;
    private SkinType skinType;
    private SkinTone skinTone;
    private Map<String, Integer> topKeywords;
}
