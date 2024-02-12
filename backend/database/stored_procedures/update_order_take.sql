CREATE OR REPLACE FUNCTION update_order_take(_order_id VARCHAR, _manager_id INT) RETURNS VOID
    LANGUAGE plpgsql AS
$$
BEGIN
    IF _order_id = '' THEN
        RAISE EXCEPTION 'пустой id заказа';
    END IF;

    IF NOT EXISTS(SELECT 1
                  FROM orders o
                  WHERE o.order_id = _order_id
                    AND o.order_status = 'new') THEN
        RAISE EXCEPTION 'order with id % and status new was not found', _order_id;
    END IF;

    IF NOT EXISTS(SELECT 1
              FROM users u
              WHERE u.id = _manager_id
              AND u.role = 'client_manager') THEN
        RAISE EXCEPTION 'manager with id % was not found', _manager_id;
    END IF;

    UPDATE orders o
    SET order_status = 'specification',
        manager_id = _manager_id
    WHERE o.order_id = _order_id;

    INSERT INTO order_logs (order_id, new_status, dt) VALUES (_order_id, 'specification', now());
END;
$$;
