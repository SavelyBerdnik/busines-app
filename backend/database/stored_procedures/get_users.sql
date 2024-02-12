CREATE OR REPLACE FUNCTION get_users() RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT *
          FROM users) res;

    RETURN _res;
END;
$$;