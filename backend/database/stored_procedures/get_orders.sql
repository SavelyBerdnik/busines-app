CREATE OR REPLACE FUNCTION get_orders(_user_id BIGINT, _status VARCHAR) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
    _user_role VARCHAR;
BEGIN
    SELECT u.role
    INTO _user_role
    FROM users u
    WHERE u.id = _user_id;
    RAISE NOTICE '%', _user_role;
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT DISTINCT
                 o.order_id,
                 o.order_name,
                 o.order_status,
                 o.price,
                 customer_id,
                 customer.full_name customer_name,
                 o.end_dt,
                 manager_id,
                 manager.full_name manager_name,
                 o.dt,
                 g.dimensions,
                 g.goods_description,
                 o.good_id,
                 ARRAY_AGG(we.image_path) OVER (PARTITION BY o.order_id) image_paths
    FROM orders o
        LEFT JOIN users customer ON o.customer_id = customer.id
        LEFT JOIN users manager ON o.manager_id = manager.id
        LEFT JOIN public.goods g on o.good_id = g.good_id
        JOIN public.work_examples we ON o.work_examples_id = we.work_example_id
    WHERE
        (CASE WHEN _user_role='client' THEN o.customer_id=_user_id ELSE TRUE END
            AND
        CASE WHEN _user_role='client_manager' THEN o.manager_id=_user_id
                                               OR o.manager_id IS NULL ELSE TRUE END
            AND
        CASE WHEN _user_role='purchase_manager' THEN o.order_status='purchase' ELSE TRUE END
            AND
        CASE WHEN _user_role='master' THEN o.order_status='production'
                                       OR o.order_status='control' ELSE TRUE END
            AND
        CASE WHEN _user_role='director' THEN TRUE ELSE TRUE END)
        AND
        (CASE WHEN _status = '' THEN TRUE END
            OR
        CASE WHEN _status = 'new' THEN o.order_status='new' OR o.order_status='specification' OR o.order_status='confirmation' END
            OR
        CASE WHEN _status = 'declined' THEN o.order_status='declined' END
            OR
        CASE WHEN _status = 'current' THEN o.order_status='production' OR o.order_status='purchase' OR o.order_status='control' END
            OR
        CASE WHEN _status = 'done' THEN o.order_status='ready' OR o.order_status='done' END)) res;

    RETURN _res;
END;
$$;

select get_orders(1004, '')