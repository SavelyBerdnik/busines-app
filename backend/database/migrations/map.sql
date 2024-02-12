DROP TABLE IF EXISTS public.map;
CREATE TABLE IF NOT EXISTS public.map
(
    id            BIGSERIAL    NOT NULL,
    x REAL NOT NULL,
    y REAL NOT NULL,
    image_name VARCHAR NOT NULL,
    map_name VARCHAR NOT NULL,
    CONSTRAINT pk_map_ids PRIMARY KEY (id)
);
