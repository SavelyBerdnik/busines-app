CREATE OR REPLACE FUNCTION create_specification_finish(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _goods_id            bigint;
    _dimensions         varchar;
    _operation_sequence varchar;
BEGIN
    SELECT s.good_id,
           s.dimensions,
           s.operation_sequence
    INTO _goods_id,
         _dimensions,
         _operation_sequence
    FROM JSON_TO_RECORD(_js) AS s(good_id            bigint,
                                  dimensions         varchar,
                                  operation_sequence varchar);
    UPDATE goods g
    SET operation_sequence=_operation_sequence,
        dimensions=_dimensions
    WHERE g.good_id=_goods_id;
END;
$$;