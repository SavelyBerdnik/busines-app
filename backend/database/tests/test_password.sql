CREATE OR REPLACE FUNCTION test_password(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _login         VARCHAR;
    _password      VARCHAR;
    _error         VARCHAR = '';
BEGIN
    SELECT login,
           password
    INTO _login,
         _password
    FROM JSON_TO_RECORD(_js) AS s(login      VARCHAR,
                                  password   VARCHAR);

    IF _login = '' OR _login IS NULL THEN
        _error = _error || 'поле "Логин" пустое' || E'\n';
    END IF;
    IF _password = '' OR _password IS NULL THEN
        _error = _error || 'поле "Пароль" пустое' || E'\n';
    END IF;
    IF length(_password) > 20 OR length(_password) < 5 THEN
        _error = _error || 'длина пароля должна быть от 5 до 20 символов' || E'\n';
    END IF;
    IF _password LIKE '%' || _login || '%' THEN
        _error = _error || 'пароль не должен содержать логин' || E'\n';
    END IF;
    IF _password !~ '[A-Z]' THEN
        _error = _error || 'пароль должен содержать заглавные буквы' || E'\n';
    END IF;
    IF _password !~ '[a-z]' THEN
        _error = _error || 'пароль должен содержать строчные буквы' || E'\n';
    END IF;

    IF _error != '' THEN
        RAISE NOTICE '%' , _error;
        RETURN;
    END IF;

    RAISE NOTICE 'success';
END;
$$;
