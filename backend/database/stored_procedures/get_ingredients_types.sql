CREATE OR REPLACE FUNCTION get_ingredients_types() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT i.ingredients_type
          FROM public.ingredients i
          WHERE i.ingredients_type!='' AND i.ingredients_type IS NOT NULL
          GROUP BY i.ingredients_type)  res ;
    RETURN _res;
END;
$$;

select get_ingredients_types()