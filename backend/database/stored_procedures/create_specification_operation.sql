CREATE OR REPLACE FUNCTION create_specification_operation(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _goods_id INT;
BEGIN
    SELECT s.goods_id
    INTO _goods_id
    FROM JSON_TO_RECORDSET(_js) AS s(goods_id        bigint);
    RAISE NOTICE '%', _goods_id;
    DELETE FROM specificationoperations scd
    WHERE scd.goods_id=_goods_id;

    WITH cte AS (
        SELECT s.goods_id,
               s.operation,
               s.eqp_type_id,
               s.operation_seq,
               s.op_time,
               s.semif
        FROM JSON_TO_RECORDSET(_js) AS s(goods_id       BIGINT,
                                         operation      VARCHAR,
                                         eqp_type_id    INT,
                                         operation_seq  INT,
                                         op_time        INT,
                                         semif          VARCHAR)
    )

    INSERT INTO specificationoperations (goods_id,
                                         operation,
                                         eqp_type_id,
                                         op_time,
                                         semif,
                                         operation_seq)
    SELECT c.goods_id,
           c.operation,
           c.eqp_type_id,
           c.op_time,
           c.semif,
           c.operation_seq
    FROM cte c;
END;
$$;