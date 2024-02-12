CREATE OR REPLACE FUNCTION get_specification_final(_good_id INT) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT ROW_TO_JSON(res)
    INTO _res
    FROM (SELECT g.good_id,
                 g.operation_sequence,
                 g.dimensions
          FROM public.goods g
          WHERE g.good_id=_good_id) res;

    RETURN _res;
END;
$$;
