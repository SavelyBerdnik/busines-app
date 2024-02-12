CREATE OR REPLACE FUNCTION create_map_icon(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _x REAL;
    _y REAL;
    _image_name VARCHAR;
    _map_name VARCHAR;
BEGIN
    SELECT x,
           y,
           image_name,
           map_name
    INTO _x,
         _y,
         _image_name,
         _map_name
    FROM JSON_TO_RECORD(_js) AS s(x REAL,
                                  y REAL,
                                  image_name VARCHAR,
                                  map_name VARCHAR);

    INSERT INTO map (x, y, image_name, map_name)
    VALUES (_x, _y, _image_name, _map_name);
END;
$$;
