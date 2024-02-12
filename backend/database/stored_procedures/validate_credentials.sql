CREATE OR REPLACE FUNCTION validate_credentials(_js JSON) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _id              INT;
    _login           VARCHAR;
    _password        VARCHAR;
    _db_password     VARCHAR;
    _error           VARCHAR = '';
    _role            VARCHAR;
    _full_name       VARCHAR;
    _image_path      VARCHAR;
BEGIN
    SELECT login,
           password
    INTO _login,
         _password
    FROM JSON_TO_RECORD(_js) AS s(login    VARCHAR(50),
                                  password VARCHAR(500));

    IF _login = '' OR _login IS NULL THEN
        _error = 'необходимо указать логин';
    ELSEIF _password = '' OR _password IS NULL THEN
        _error = 'необходимо ввести пароль';
    END IF;

    IF _error != '' THEN
        RAISE EXCEPTION '%' , _error;
    END IF;

    SELECT u.id,
           u.password
    INTO _id,
         _db_password
    FROM users u
    WHERE u.login = _login;

    IF _db_password IS NULL OR _db_password != _password
    THEN
        RAISE EXCEPTION 'неверный логин или пароль';
    END IF;

    RAISE NOTICE '% ', _db_password IS NOT NULL;

    SELECT u.full_name,
           u.image_path,
           u.login,
           u.role
    INTO _full_name,
         _image_path,
         _login,
         _role
    FROM users u
    WHERE u.id = _id;

    RETURN json_build_object('id', _id, 'role', _role, 'full_name', _full_name, 'login', _login, 'image_path', _image_path);
END;
$$;
