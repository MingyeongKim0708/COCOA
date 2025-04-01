package com.cocoa.backend.domain.user.dto.reqeust;

import com.cocoa.backend.domain.user.entity.Gender;
import com.cocoa.backend.domain.user.entity.SkinTone;
import com.cocoa.backend.domain.user.entity.SkinType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SignupRequestDTO {
    private String nickname;
    private LocalDate birthDate;
    private Gender gender;
    private SkinType skinType;
    private SkinTone skinTone;
}
