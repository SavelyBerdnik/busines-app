CREATE OR REPLACE FUNCTION get_eqp_failure_diag() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
_res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (
        SELECT ef.reason,
               SUM(ef.fail_time) sum_fail_time
        FROM public.equipment_failure ef
        GROUP BY ef.reason
        ORDER BY sum_fail_time DESC) res;
    RETURN _res;
END;
$$;
