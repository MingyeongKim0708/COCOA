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
          	SELECT jsonb_object_agg(
				COALESCE(k1.key, k2.key),
				((COALESCE(k2.value, '0')::int) + (COALESCE(k1.value, '0')::int))::text
			)
			FROM jsonb_each_text(keywords) AS k1(key, value)
			FULL OUTER JOIN jsonb_each_text(CAST(:keywordJson AS jsonb)) AS k2(key, value)
			ON k1.key = k2.key
        )
		WHERE cosmetic_id = :cosmeticId
	""", nativeQuery = true)
	void updateKeywords(@Param("cosmeticId") int cosmeticId, @Param("keywordJson") String keywordJson);

	@Modifying
	@Query(value = """
		UPDATE cosmetic_keywords
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
		WHERE cosmetic_id = :cosmeticId
		""", nativeQuery = true)
	void subtractKeywords(@Param("cosmeticId") int cosmeticId, @Param("keywordJson") String keywordJson);
}
