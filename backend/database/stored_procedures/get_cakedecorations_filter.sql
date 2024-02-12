CREATE OR REPLACE FUNCTION get_cakedecorations_filter(_dt INTEGER) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
_res JSON;
_count INTEGER;
_purchase_sum NUMERIC(8,2);
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res)), SUM(res.qty), SUM(res.purchase_price)
    INTO _res, _count, _purchase_sum
    FROM (SELECT c.sku_id,
                 c.sku_name,
                 c.qty,
                 c.unit,
                 c.purchase_price,
                 s.supplier_id,
                 s.supplier_name,
                 s.edt,
                 c.exp_dt
          FROM public.cakedecoration c
          LEFT JOIN suppliers s ON c.supplier_id = s.supplier_id
          WHERE c.exp_dt <= _dt) res;
    RETURN JSON_BUILD_OBJECT('data', _res, 'count', _count, 'purchase_sum', _purchase_sum);
END;
$$;