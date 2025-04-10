package com.cocoa.backend.global.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import org.postgresql.util.PGobject;
import org.springframework.context.annotation.Configuration;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Converter
public class KeywordJsonConverter implements AttributeConverter<Map<String, Integer>, Object> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Object convertToDatabaseColumn(Map<String, Integer> attribute) {
        try {
            if (attribute == null || attribute.isEmpty()) return new HashMap<>();

            PGobject jsonbObj = new PGobject();
            jsonbObj.setType("jsonb");
            jsonbObj.setValue(objectMapper.writeValueAsString(attribute));
            return jsonbObj;

        } catch (Exception e) {
            throw new IllegalArgumentException("키워드 변환 실패", e);
        }
    }

    @Override
    public Map<String, Integer> convertToEntityAttribute(Object dbData) {
        try {
            if (dbData == null) return new HashMap<>();
            return objectMapper.readValue(dbData.toString(), new TypeReference<>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("키워드 역변환 실패", e);
        }
    }
}