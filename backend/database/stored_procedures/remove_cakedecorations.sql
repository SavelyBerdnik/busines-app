CREATE OR REPLACE FUNCTION remove_cakedecorations(_sku_id INT) RETURNS VOID
    LANGUAGE plpgsql AS
$$
BEGIN
    IF NOT EXISTS(SELECT 1
                  FROM cakedecoration c
                  WHERE c.qty = 0
                    AND c.sku_id = _sku_id)
    THEN
        RAISE EXCEPTION 'this decoration qty is not 0';
    END IF;

    IF EXISTS(select 1
          FROM specificationcakedecoration scd
          WHERE scd.sku_id = _sku_id)
    THEN
        RAISE EXCEPTION 'this decoration is in the specification and cannot be deleted';
    END IF;

    DELETE FROM cakedecoration c
    WHERE c.qty = 0
      AND c.sku_id = _sku_id;
END;
$$;