CREATE OR REPLACE FUNCTION get_map_icons(_map_name VARCHAR) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _res JSON;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _res
    FROM (SELECT m.id,
                 m.x,
                 m.y,
                 m.map_name,
                 m.image_name
          FROM public.map m
          WHERE m.map_name=_map_name) res;

    RETURN _res;
END;
$$;
