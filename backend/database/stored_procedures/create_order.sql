CREATE OR REPLACE FUNCTION create_order(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _order_id      VARCHAR;
    _order_name    VARCHAR;
    _order_status  VARCHAR;
    _client_id   BIGINT;
    _end_dt        TIMESTAMP;
    _dt            DATE;
    _manager_id    BIGINT;
    _customer_name VARCHAR;
    _previous_id   VARCHAR;
    _goods_id        INT;
    _goods_description VARCHAR;
    _dimensions VARCHAR;
    _order_num INT;
    _image_paths VARCHAR[];
    _next_work_example_id INT;

    _error        VARCHAR;
BEGIN
    SELECT order_name,
           order_status,
           customer_id,
           end_dt,
           now(),
           manager_id,
           goods_dimensions,
           goods_description,
           image_paths
    INTO _order_name,
         _order_status,
         _client_id,
         _end_dt,
         _dt,
         _manager_id,
         _dimensions,
         _goods_description,
         _image_paths
    FROM JSON_TO_RECORD(_js) AS s(order_name    VARCHAR,
                                  customer_id   INTEGER,
                                  manager_id    INTEGER,
                                  end_dt        DATE,
                                  work_examples VARCHAR,
                                  goods_description VARCHAR,
                                  goods_dimensions VARCHAR,
                                  order_status VARCHAR,
                                  image_paths VARCHAR[]);

    IF NOT EXISTS (SELECT 1 FROM users u WHERE u.id = _client_id AND u.role='client') THEN
        _error = 'Не существует выбранного клиента ' || _client_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM users u WHERE u.id = _manager_id AND u.role='client_manager') AND _manager_id!=0 THEN
        _error = 'Не существует выбранного менеджера';
    END IF;

    IF _order_name = '' THEN
        _error = 'Пустое поле имени товара/заказа';
    END IF;

    IF _goods_description = '' THEN
        _error = 'Пустое поле описания товара';
    END IF;

    IF _dimensions = '' THEN
        _error = 'Пустое поле имени размеров';
    END IF;

    IF _error != '' THEN
        RAISE EXCEPTION '%' , _error;
    END IF;

    SELECT u.full_name
    INTO _customer_name
    FROM users u
    WHERE u.id=_client_id;

    _dt = now();
    _order_id = to_char(_dt, 'DDMMYYYY') ||
                substring(split_part(_customer_name, ' ', 1) FROM 1 FOR 1) ||
                substring(split_part(_customer_name, ' ', 2) FROM 1 FOR 1);


    SELECT o.order_id
    INTO _previous_id
    FROM orders o
    WHERE o.order_id LIKE _order_id || '%'
    ORDER BY order_id DESC;

    IF _previous_id IS NOT NULL AND _previous_id != '' THEN
        _order_num = (substring(_previous_id FROM 11 FOR 2)::INT + 1);
        IF _order_num < 10 THEN
            _order_id =  _order_id || '0' || _order_num::VARCHAR;
        ELSE
            _order_id =  _order_id || _order_num::VARCHAR;
        END IF;
    ELSE
        _order_id = _order_id || '00';
    END IF;

    INSERT INTO public.goods (goods_name,
                              goods_description,
                              dimensions,
                              operation_sequence)
    VALUES (_order_name,
            _goods_description,
            _dimensions,
            '')
    RETURNING
        good_id
    INTO
        _goods_id;

    IF _manager_id = 0 THEN
        _manager_id = NULL;
    END IF;

    SELECT max(we.work_example_id) + 1
    INTO _next_work_example_id
    FROM work_examples we;

    RAISE NOTICE '%', _image_paths;
    FOR i IN 1..array_length(_image_paths, 1) LOOP
          INSERT INTO public.work_examples (work_example_id, image_path)
        SELECT _next_work_example_id,
               _image_paths[i];
    END LOOP;

    INSERT INTO public.orders (order_id,
                               good_id,
                               dt,
                               order_name,
                               customer_id,
                               manager_id,
                               order_status,
                               work_examples_id)
    VALUES (_order_id,
            _goods_id,
            _dt,
            _order_name,
            _client_id,
            _manager_id,
            _order_status,
            _next_work_example_id);

    INSERT INTO order_logs (order_id, new_status, dt) VALUES (_order_id, _order_status, _dt);
END;
$$;