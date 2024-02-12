CREATE OR REPLACE FUNCTION get_role_by_uid(_user_id BIGINT) RETURNS VARCHAR
    LANGUAGE plpgsql AS
$$
DECLARE
    _user_role VARCHAR;
BEGIN
    IF NOT EXISTS(SELECT 1
                  FROM users u
                  WHERE u.id=_user_id) THEN
        RAISE EXCEPTION 'Пользователь не существует';
    END IF;

    SELECT u.role
    INTO _user_role
    FROM users u
    WHERE u.id = _user_id;

    RETURN _user_role;
END;
$$;
