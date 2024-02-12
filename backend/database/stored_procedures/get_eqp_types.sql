CREATE OR REPLACE FUNCTION get_eqp_types() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
_res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT et.eqp_type_id,
                 et.eqp_type_name
          FROM public.equipmenttypes et) res;
    RETURN _res;
END;
$$;
