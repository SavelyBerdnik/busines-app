CREATE OR REPLACE FUNCTION get_cakedecoration_types() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT i.cake_decor_type
          FROM public.cakedecoration i
          WHERE i.cake_decor_type!='' AND i.cake_decor_type IS NOT NULL
          GROUP BY i.cake_decor_type)  res ;
    RETURN _res;
END;
$$;

select get_cakedecoration_types()