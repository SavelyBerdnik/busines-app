CREATE OR REPLACE FUNCTION get_specification_ingredients(_good_id INT) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT si.qty,
                 si.ingredient_id,
                 si.good_id
          FROM public.specificationingredients si
          WHERE si.good_id=_good_id) res;

    RETURN _res;
END;
$$;
