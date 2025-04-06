package com.cocoa.backend.domain.user.dto.response;

import com.cocoa.backend.domain.user.entity.Gender;
import com.cocoa.backend.domain.user.entity.SkinTone;
import com.cocoa.backend.domain.user.entity.SkinType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private UserDTO user;
    private Map<String, Integer> keywords;
}
