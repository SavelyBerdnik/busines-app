CREATE OR REPLACE FUNCTION get_cakedecorations_pages(_page INT, _type VARCHAR) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT c.sku_id,
                 c.sku_name,
                 c.qty,
                 c.unit,
                 c.exp_dt
          FROM public.cakedecoration c
          LEFT JOIN suppliers s ON c.supplier_id = s.supplier_id
          WHERE _page * 3 < c.exp_dt and c.exp_dt < (_page + 1) * 3 AND
          CASE WHEN  _type != '' THEN c.cake_decor_type=_type ELSE TRUE END
          ORDER BY c.exp_dt) res;
    RETURN _res;
END;
$$;

select get_cakedecorations_pages(1, '')