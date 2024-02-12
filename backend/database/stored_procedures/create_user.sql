CREATE OR REPLACE FUNCTION create_user(_js JSON) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _id            INT;
    _login         VARCHAR;
    _password      VARCHAR;
    _full_name     VARCHAR;
    _image_path    VARCHAR;
    _error         VARCHAR = '';
BEGIN
    SELECT login,
           password,
           full_name,
           image_path
    INTO _login,
         _password,
         _full_name,
         _image_path
    FROM JSON_TO_RECORD(_js) AS s(login      VARCHAR,
                                  password   VARCHAR,
                                  full_name  VARCHAR,
                                  image_path VARCHAR);

    IF _login = '' OR _login IS NULL THEN
        _error = _error || 'поле "Логин" пустое' || E'\n';
    END IF;
    IF _password = '' OR _password IS NULL THEN
        _error = _error || 'поле "Пароль" пустое' || E'\n';
    END IF;
    IF _full_name = '' OR _full_name IS NULL THEN
        _error = _error || 'поле "ФИО" пустое' || E'\n';
    END IF;
    IF array_length(string_to_array(_full_name, ' '), 1) < 2  THEN
        _error = _error || 'поле "ФИО" содержит недостаточно слво' || E'\n';
    END IF;
    IF _image_path = '' OR _image_path IS NULL THEN
        _error = _error || 'поле "путь к изображению" пустое' || E'\n';
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
        RAISE EXCEPTION '%' , _error;
    END IF;

    IF EXISTS(SELECT 1
              FROM users u
              WHERE lower(u.login) = lower(_login))
    THEN
        RAISE EXCEPTION 'логин % занят', _login;
    END IF;

    INSERT INTO users(login,
                      password,
                      full_name,
                      image_path,
                      role)
    VALUES (_login,
            _password,
            _full_name,
            _image_path,
            'client')
    RETURNING id
    INTO _id;

    RETURN json_build_object('id', _id, 'role', 'client', 'full_name', _full_name, 'login', _login, 'image_path', _image_path);
END;
$$;

