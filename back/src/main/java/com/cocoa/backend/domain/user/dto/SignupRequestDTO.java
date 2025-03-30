package com.cocoa.backend.domain.user.dto;

import com.cocoa.backend.domain.user.entity.Gender;
import com.cocoa.backend.domain.user.entity.SkinTone;
import com.cocoa.backend.domain.user.entity.SkinType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestDTO {
    private String nickname;
    private Short birthYear;
    private Short birthMonth;
    private Short birthDay;
    private Gender gender;
    private SkinType skinType;
    private SkinTone skinTone;
}
