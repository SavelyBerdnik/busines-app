CREATE OR REPLACE FUNCTION update_order_specify(_src JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _order_id VARCHAR;
    _price DECIMAL(8, 2);
    _end_dt DATE;
BEGIN
    SELECT src.order_id,
           src.price,
           src.end_dt
    INTO _order_id,
         _price,
         _end_dt
    FROM JSON_TO_RECORD(_src) AS src(order_id VARCHAR,
                                     price DECIMAL(8,2),
                                     end_dt DATE);


    IF _order_id = '' THEN
        RAISE EXCEPTION 'пустой id заказа';
    END IF;

    IF NOT EXISTS(SELECT 1
                  FROM orders o
                  WHERE o.order_id = _order_id
                    AND o.order_status = 'specification') THEN
        RAISE EXCEPTION 'order with id % with status specification was not found', _order_id;
    END IF;

    IF _end_dt < now()::DATE THEN
        RAISE EXCEPTION 'date cannot be set sonner than today';
    END IF;

    IF _price <= 0 THEN
        RAISE EXCEPTION 'price cannot be set lower or equal to null';
    END IF;

    UPDATE orders o
    SET order_status = 'confirmation',
        price = _price,
        end_dt = _end_dt
    WHERE o.order_id = _order_id;

    INSERT INTO order_logs (order_id, new_status, dt) VALUES (_order_id, 'confirmation', now());
END;
$$;
