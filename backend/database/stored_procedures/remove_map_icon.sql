CREATE OR REPLACE FUNCTION remove_map_icon(_id VARCHAR) RETURNS VOID
    LANGUAGE plpgsql AS
$$
BEGIN
    DELETE
    FROM map m
    WHERE m.image_name=_id;
END;
$$;
