package com.cocoa.backend.domain.user.repository;

import java.util.Map;

import com.cocoa.backend.domain.user.entity.UserKeywords;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserKeywordsRepository extends JpaRepository<UserKeywords, Long> {
    @Modifying
    @Query(value = """
        UPDATE user_keywords
        SET keywords = (
            SELECT jsonb_object_agg(
                COALESCE(k1.key, k2.key),
                ((COALESCE(k2.value, '0')::int) + (COALESCE(k1.value, '0')::int))::text
            )
            FROM jsonb_each_text(keywords) AS k1(key, value)
            FULL OUTER JOIN jsonb_each_text(CAST(:keywordJson AS jsonb)) AS k2(key, value)
            ON k1.key = k2.key
        )
        WHERE user_id = :userId
    """, nativeQuery = true)
    void updateKeywords(@Param("userId") Long userId, @Param("keywordJson") String keywordJson);

    @Modifying
    @Query(value = """
    UPDATE user_keywords
        SET keywords = (
			SELECT jsonb_strip_nulls(
				jsonb_object_agg(
					COALESCE(k1.key, k2.key),
					CASE
						WHEN ((COALESCE(k1.value, '0')::int) - (COALESCE(k2.value, '0')::int)) <= 0
						THEN NULL
						ELSE ((COALESCE(k1.value, '0')::int) - (COALESCE(k2.value, '0')::int))::text
					END
				)
			)
			FROM jsonb_each_text(keywords) AS k1(key, value)
			FULL OUTER JOIN jsonb_each_text(CAST(:keywordJson AS jsonb)) AS k2(key, value)
			ON k1.key = k2.key
		)
    WHERE user_id = :userId
    """, nativeQuery = true)
    void subtractKeywords(@Param("userId") Long userId, @Param("keywordJson") String keywordJson);

    @Modifying
    @Query(value = """
    INSERT INTO user_keywords (user_id, keywords, top_keywords)
    VALUES (:userId, NULL, NULL)
    ON CONFLICT (user_id) DO NOTHING
    """, nativeQuery = true)
    void saveInitial(@Param("userId") Long userId);
}