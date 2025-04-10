package com.cocoa.backend.domain.user.repository;

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
            SELECT jsonb_object_agg(key, (COALESCE(keywords->>key, '0')::int + value::int))
            FROM jsonb_each_text(CAST(CAST(:keywordJson AS jsonb) AS jsonb)) AS t(key, value)
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
              key,
              CASE
                WHEN (COALESCE(keywords->>key, '0')::int - value::int) <= 0
                THEN NULL
                ELSE (COALESCE(keywords->>key, '0')::int - value::int)::text
              END
            )
          )
          FROM jsonb_each_text(CAST(:keywordJson AS jsonb)) AS t(key, value)
        )
        WHERE user_id = :userId
    """, nativeQuery = true)
    void subtractKeywords(@Param("userId") Long userId, @Param("keywordJson")  String keywordJson);

    @Modifying
    @Query(value = """
    INSERT INTO user_keywords (user_id, keywords, top_keywords)
    VALUES (:userId, NULL, NULL)
    ON CONFLICT (user_id) DO NOTHING
    """, nativeQuery = true)
    void saveInitial(@Param("userId") Long userId);
}