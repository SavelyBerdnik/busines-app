CREATE OR REPLACE FUNCTION update_order_cancel(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _reason   VARCHAR;
    _order_id VARCHAR;
    _current_status VARCHAR;
BEGIN
    SELECT reason,
           order_id
    INTO _reason,
         _order_id
    FROM JSON_TO_RECORD(_js) AS (reason   VARCHAR,
                                 order_id VARCHAR);

    IF _order_id = '' THEN
        RAISE EXCEPTION 'пустой id заказа';
    END IF;

    IF NOT EXISTS(SELECT 1
                  FROM orders o
                  WHERE o.order_id = _order_id) THEN
        RAISE EXCEPTION 'order with id % does not exists', _order_id;
    END IF;

    SELECT o.order_status
    INTO _current_status
    FROM orders o
    WHERE o.order_id = _order_id;

    IF _reason = '' AND _current_status = 'new' THEN
        RAISE EXCEPTION 'не указана причина отмены';
    END IF;

    IF _reason = '' THEN
        _reason = 'canceled by manager at confirmation stage';
    END IF;

    UPDATE orders o
    SET order_status = 'declined'
    WHERE o.order_id = _order_id;

    INSERT INTO declined_orders_reasons (order_id, reason) VALUES (_order_id, _reason);
    INSERT INTO order_logs (order_id, new_status, dt) VALUES (_order_id, 'declined', now());
END;
$$;
