from db.ingredient_dao import get_old_cosmetic_ingredient_text_by_cosmetic_id, insert_ingredient_text


def parse_ingredient_by_cosmetic_id(cosmetic_id, newcosmetic_id):
    dictionary = get_old_cosmetic_ingredient_text_by_cosmetic_id(cosmetic_id)

    for k, v in dictionary.items():
        dictionary[k] = v.replace("_", ",")

    insert_ingredient_text(newcosmetic_id, dictionary)
