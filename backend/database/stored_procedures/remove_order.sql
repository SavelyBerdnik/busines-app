CREATE OR REPLACE FUNCTION remove_order(_order_id VARCHAR) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _goods_id INT;
BEGIN
    DELETE FROM public.orders o
    WHERE o.order_id = _order_id
    RETURNING good_id
    INTO _goods_id;

    DELETE FROM public.orders o
    WHERE o.good_id = _goods_id;
END;
$$;