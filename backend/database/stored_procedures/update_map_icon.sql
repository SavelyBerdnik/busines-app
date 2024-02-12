CREATE OR REPLACE FUNCTION update_map_icon(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _x REAL;
    _y REAL;
    _image_name VARCHAR;
BEGIN
    SELECT x,
           y,
           image_name
    INTO _x,
         _y,
         _image_name
    FROM JSON_TO_RECORD(_js) AS s(x REAL,
                                  y REAL,
                                  image_name VARCHAR,
                                  map_name VARCHAR);

    UPDATE map m
    SET x=_x,
        y=_y
    WHERE m.image_name=_image_name;
END;
$$;
