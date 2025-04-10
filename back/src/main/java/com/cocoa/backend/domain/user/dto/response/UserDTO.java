package com.cocoa.backend.domain.user.dto.response;

import java.time.LocalDate;
import java.time.Period;

import com.cocoa.backend.domain.user.entity.Gender;
import com.cocoa.backend.domain.user.entity.SkinTone;
import com.cocoa.backend.domain.user.entity.SkinType;
import com.cocoa.backend.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String nickname;
    private String imageUrl;
    private String ageGroup;
    private Gender gender;
    private SkinType skinType;
    private SkinTone skinTone;

    static String calculateAgeGroup(LocalDate birthDate) {
        int age = Period.between(birthDate, LocalDate.now()).getYears();

        if (age < 20) return "10대";
        if (age < 30) return "20대";
        if (age < 40) return "30대";
        if (age < 50) return "40대";
        if (age < 60) return "50대";
        return "60대 이상";
    }

    public static UserDTO fromEntity(User user) {
        String ageGroup = calculateAgeGroup(user.getBirthDate());
        return new UserDTO(user.getUserId(), user.getNickname(), user.getImageUrl(), ageGroup, user.getGender(), user.getSkinType(), user.getSkinTone());
    }
}
