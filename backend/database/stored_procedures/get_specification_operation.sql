CREATE OR REPLACE FUNCTION get_specification_operation(_good_id INT) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT so.operation_seq,
                 so.eqp_type_id,
                 so.op_time,
                 so.operation,
                 so.semif,
                 so.goods_id
          FROM public.specificationoperations so
          WHERE so.goods_id=_good_id
          ORDER BY so.operation_seq) res;

    RETURN _res;
END;
$$;
