package com.cocoa.backend.domain.cosmetic.repository;

import com.cocoa.backend.domain.cosmetic.entity.CosmeticKeywords;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Map;
import java.util.Optional;

public interface CosmeticKeywordRepository extends JpaRepository<CosmeticKeywords, Integer> {
    Optional<CosmeticKeywords> findByCosmeticId(Integer cosmeticId);

	@Modifying
	@Query(value = """
		UPDATE cosmetic_keywords
		SET keywords = (
			SELECT jsonb_object_agg(key, (COALESCE(keywords->>key, '0')::int + value::int))
			FROM jsonb_each_text(CAST(:keywordJson AS jsonb)) AS t(key, value)
		)
		WHERE cosmetic_id = :cosmeticId
	""", nativeQuery = true)
	void updateKeywords(@Param("cosmeticId") int cosmeticId, @Param("keywordJson") Object keywordJson);

	@Modifying
	@Query(value = """
		UPDATE cosmetic_keywords
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
		WHERE cosmetic_id = :cosmeticId
	""", nativeQuery = true)
	void subtractKeywords(@Param("cosmeticId") int cosmeticId, @Param("keywordJson") String keywordJson);
}
