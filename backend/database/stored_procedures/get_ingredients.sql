CREATE OR REPLACE FUNCTION get_ingredients() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
_res JSON;
_count INTEGER;
_purchase_sum NUMERIC(8,2);
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res)), SUM(res.qty), SUM(res.purchase_price)
    INTO _res, _count, _purchase_sum
    FROM (SELECT i.ingredient_id,
                 i.ingredients_name,
                 i.unit,
                 COALESCE(i.qty, 0) qty,
                 i.purchase_price,
                 s.supplier_id,
                 s.supplier_name,
                 s.edt,
                 i.exp_dt
          FROM public.ingredients i
          LEFT JOIN suppliers s ON i.supplier_id = s.supplier_id
          ORDER BY ingredient_id)  res ;
    RETURN JSON_BUILD_OBJECT('data', _res, 'count', _count, 'purchase_sum', _purchase_sum);
END;
$$;
