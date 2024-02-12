CREATE OR REPLACE FUNCTION get_order_logs() RETURNS JSON
    LANGUAGE plpgsql AS
$$
BEGIN
    RETURN JSON_AGG(tb)
    FROM (SELECT *
          FROM order_logs) tb;
END;
$$
