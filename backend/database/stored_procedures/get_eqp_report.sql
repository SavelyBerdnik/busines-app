CREATE OR REPLACE FUNCTION get_eqp_report() RETURNS JSON
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
                 er.qty,
                 s.supplier_id,
                 s.supplier_name
          FROM public.equipment_report er
            LEFT JOIN public.equipment e on er.eqp_id = e.eqp_id
            LEFT JOIN public.suppliers s on er.supplier_id = s.supplier_id) res;
    RETURN _res;
END;
$$;
select get_eqp_report()