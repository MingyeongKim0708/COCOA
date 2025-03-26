from dataclasses import dataclass
from datetime import date


@dataclass
class Cosmetic:
    cosmetic_id: int
    oliveyoung_id: str
    option_id: int
    name: str | None
    option_name: str | None
    producer: str | None
    category: str | None
    target_skin: str | None
    reputation1: str | None
    reputation2: str | None
    reputation3: str | None
    reputation4: str | None
    image_url1: str | None
    image_url2: str | None
    image_url3: str | None
    created_by: str | None
    created_at: date | None
    updated_by: str | None
    updated_at: date | None
    oliveyoung_review_amount: int | None
