package com.cocoa.backend.global.util;

import java.time.LocalDate;
import java.time.Period;

public class UserUtil {
    public static String calculateAgeGroup(LocalDate birthDate) {
        int age = Period.between(birthDate, LocalDate.now()).getYears();

        if (age < 20) return "10대";
        if (age < 30) return "20대";
        if (age < 40) return "30대";
        if (age < 50) return "40대";
        if (age < 60) return "50대";
        return "60대 이상";
    }
}
