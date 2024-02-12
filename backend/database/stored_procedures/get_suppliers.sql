CREATE OR REPLACE FUNCTION get_suppliers() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
_res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT s.supplier_id,
                 s.supplier_name,
                 s.address,
                 s.edt
          FROM public.suppliers s) res;
    RETURN _res;
END;
$$;
