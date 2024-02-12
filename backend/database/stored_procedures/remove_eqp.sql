CREATE OR REPLACE FUNCTION remove_eqp(_eqp_id BIGINT) RETURNS VOID
    LANGUAGE plpgsql AS
$$
BEGIN
    DELETE FROM public.equipment e
    WHERE e.eqp_id = _eqp_id;
END;
$$;