CREATE OR REPLACE FUNCTION get_goods() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
_res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT g.good_id,
                 g.goods_name,
                 g.goods_description,
                 g.dimensions
          FROM public.goods g) res;
    RETURN _res;
END;
$$;
