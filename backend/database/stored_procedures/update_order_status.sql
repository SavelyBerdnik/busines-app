CREATE OR REPLACE FUNCTION update_order_status(_order_id VARCHAR, _status VARCHAR) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _good_id INT;
BEGIN
    IF NOT EXISTS(SELECT 1
                  FROM orders o
                  WHERE o.order_id=_order_id)
    THEN
        RAISE EXCEPTION 'order does not exists';
    END IF;

    IF _status = 'production' THEN
        IF NOT EXISTS(SELECT 1
                  FROM orders o
                  WHERE o.order_id = _order_id
                    AND o.order_status = 'purchase') THEN
            RAISE EXCEPTION 'order with id % and status purchase was not found', _order_id;
        END IF;


        SELECT g.good_id
        INTO _good_id
        FROM orders o
            LEFT JOIN goods g ON o.good_id=g.good_id
        WHERE o.order_id=_order_id;

        WITH cte AS (
            SELECT COALESCE(scd.qty, 0) qty,
                   scd.sku_id
            FROM  specificationcakedecoration scd
            WHERE scd.good_id = _good_id)
        UPDATE cakedecoration cd
        SET qty=cd.qty-c.qty
        FROM cte c
        WHERE c.sku_id=cd.sku_id;

        WITH cte AS (
            SELECT COALESCE(ssf.qty, 0) * si.qty ing_qty,
                   si.semifinished_id,
                   si.ingredient_id
            FROM  specificationsemifinished ssf
                JOIN semifinished_ingredients si ON si.semifinished_id = ssf.semifinished_id
            WHERE ssf.good_id = _good_id)
        UPDATE ingredients i
        SET qty=i.qty-c.ing_qty
        FROM cte c
        WHERE i.ingredient_id=c.ingredient_id;
    END IF;

    UPDATE public.orders o
    SET order_status=_status
    WHERE o.order_id=_order_id;

    INSERT INTO order_logs (order_id, new_status, dt) VALUES (_order_id, _status, now());
END;
$$;
