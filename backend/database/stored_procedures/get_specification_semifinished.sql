CREATE OR REPLACE FUNCTION get_specification_semifinished(_good_id INT) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT ssf.semifinished_id,
                   ssf.good_id,
                   ssf.semifinished,
                   ssf.qty,
                   json_agg(json_build_object('ingredient_id', semi_ing.ingredient_id, 'ingredient_name', i.ingredients_name, 'qty', semi_ing.qty)) semif_ings
          FROM public.specificationsemifinished ssf
           LEFT JOIN semifinished_ingredients semi_ing ON semi_ing.semifinished_id=ssf.semifinished_id
           LEFT JOIN ingredients i ON semi_ing.ingredient_id=i.ingredient_id
          WHERE ssf.good_id=_good_id
         GROUP BY (ssf.good_id, ssf.semifinished_id, ssf.semifinished)) res;
    RETURN _res;
END;
$$;
select get_specification_semifinished(3)