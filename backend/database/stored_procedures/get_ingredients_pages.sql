CREATE OR REPLACE FUNCTION get_ingredients_pages(_page INT, _type VARCHAR) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT i.ingredient_id,
                 i.ingredients_name,
                 i.unit,
                 COALESCE(i.qty, 0) qty,
                 i.exp_dt
          FROM public.ingredients i
          WHERE _page * 3 < i.exp_dt and i.exp_dt < (_page + 1) * 3 AND
          CASE WHEN  _type != '' THEN i.ingredients_type=_type ELSE TRUE END
          ORDER BY exp_dt)  res ;
    RETURN _res;
END;
$$;

select get_ingredients_pages(2, 'Ароматизаторы')