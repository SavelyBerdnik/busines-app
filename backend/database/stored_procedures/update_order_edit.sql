CREATE OR REPLACE FUNCTION update_order_edit(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _order_id VARCHAR;
    _order_name VARCHAR;
    _goods_description VARCHAR;
    _dimensions VARCHAR;
    _error VARCHAR;
    _goods_id INT;
BEGIN
    SELECT order_id,
           order_name,
           goods_description,
           goods_dimensions
    INTO _order_id,
        _order_name,
        _goods_description,
        _dimensions
    FROM JSON_TO_RECORD(_js) AS s(order_id VARCHAR,
                                  order_name VARCHAR,
                                  goods_description VARCHAR,
                                  goods_dimensions VARCHAR);

    IF _order_name = '' THEN
        _error = 'Пустое поле имени товара/заказа';
    END IF;

    IF _goods_description = '' THEN
        _error = 'Пустое поле описания товара';
    END IF;

    IF _dimensions = '' THEN
        _error = 'Пустое поле имени размеров';
    END IF;

    IF _error != '' AND _error IS NOT NULL THEN
        RAISE EXCEPTION '%', _error;
    END IF;

    IF NOT EXISTS(SELECT 1
                  FROM orders o
                  WHERE o.order_id = _order_id) THEN
        RAISE EXCEPTION 'order with id % was not found', _order_id;
    END IF;

    UPDATE orders o
    SET order_name= _order_name
    WHERE o.order_id = _order_id
    RETURNING o.good_id
    INTO _goods_id;

    UPDATE goods g
    SET goods_name = _order_name,
        goods_description = _goods_description,
        dimensions = _dimensions
    WHERE g.good_id=_goods_id;

    INSERT INTO order_logs (order_id, new_status, dt) VALUES (_order_id, 'updated', now());
END;
$$;
