CREATE OR REPLACE FUNCTION get_eqp() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
_res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT e.eqp_id,
                 e.eqp_title,
                 e.eqp_type_id,
                 e.eqp_buy_date,
                 e.eqp_qty
          FROM public.equipment e) res;
    RETURN _res;
END;
$$;