CREATE OR REPLACE FUNCTION create_specification_ingredients(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _goods_id INT;
BEGIN
    SELECT s.good_id
    INTO _goods_id
    FROM JSON_TO_RECORDSET(_js) AS s(good_id        bigint);

    DELETE FROM specificationingredients scd
    WHERE scd.good_id=_goods_id;

    WITH cte AS (
        SELECT s.good_id,
               s.ingredient_id,
               s.qty
        FROM JSON_TO_RECORDSET(_js) AS s(good_id        bigint,
                                      ingredient_id integer,
                                      qty            smallint)
    )
    INSERT INTO specificationingredients (good_id, ingredient_id, qty)
    SELECT c.good_id,
           c.ingredient_id,
           c.qty
    FROM cte c;
END;
$$;