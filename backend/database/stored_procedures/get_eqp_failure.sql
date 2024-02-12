CREATE OR REPLACE FUNCTION get_eqp_failure() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
_res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (
        SELECT ef.id,
               ef.reason,
               ef.fail_time,
               ef.fail_date,
               ef.eqp_id
        FROM public.equipment_failure ef
        ORDER BY ef.reason, ef.id) res;
    RETURN _res;
END;
$$;
select get_eqp_failure()