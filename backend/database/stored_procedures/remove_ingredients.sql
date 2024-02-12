CREATE OR REPLACE FUNCTION remove_ingredients(_ingredient_id INT) RETURNS VOID
    LANGUAGE plpgsql AS
$$
BEGIN
    IF NOT EXISTS(SELECT 1
                  FROM ingredients i
                  WHERE i.qty = 0
                    AND i.ingredient_id = _ingredient_id)
    THEN
        RAISE EXCEPTION 'this ingredient qty is not 0';
    END IF;

    IF EXISTS(select 1
              FROM specificationingredients si
              WHERE si.ingredient_id = _ingredient_id)
    THEN
        RAISE EXCEPTION 'this ingredient is in the specification and cannot be deleted';
    END IF;

    IF EXISTS(select 1
          FROM semifinished_ingredients si
          WHERE si.ingredient_id = _ingredient_id)
    THEN
        RAISE EXCEPTION 'this ingredient is in the specification of semifinished and cannot be deleted';
    END IF;

    DELETE FROM ingredients i
    WHERE i.qty = 0
      AND i.ingredient_id = _ingredient_id;
END;
$$;
