from .cosmetic_dao import (
    insert_cosmetic_from_fields,
    insert_cosmetic_from_object,
    is_in_child_cosmetic,
    insert_same_cosmetic,
    update_same_cosmetic,
    get_cosmetic_by_oliveyoung_id_and_opt_no,
    get_all_distinct_parent_cosmetics
)

from .ingredient_dao import (
    insert_ingredient_text,
    get_cosmetic_ingredient_text_by_cosmetic_id
)
