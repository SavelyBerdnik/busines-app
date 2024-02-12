CREATE OR REPLACE FUNCTION get_specification_cakedecorations(_good_id INT) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT scd.qty,
                 scd.sku_id,
                 scd.good_id
          FROM public.specificationcakedecoration scd
          WHERE scd.good_id=_good_id) res;
    RETURN _res;
END;
$$;
