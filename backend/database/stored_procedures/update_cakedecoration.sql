CREATE OR REPLACE FUNCTION update_cakedecoration(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _sku_id          INTEGER;
    _sku_name        VARCHAR;
    _unit            VARCHAR;
    _qty             INTEGER;
    _cake_decor_type VARCHAR;
    _supplier_id     INTEGER;
    _purchase_price  NUMERIC(8,2);
    _weight          VARCHAR;
    _exp_dt          INTEGER;

    _error           VARCHAR;
BEGIN
    SELECT  sku_id,
            sku_name,
            unit,
            qty,
            cake_decor_type,
            supplier_id,
            purchase_price,
            weight,
            exp_dt
    INTO _sku_id,
         _sku_name,
         _unit,
         _qty,
         _cake_decor_type,
         _supplier_id,
         _purchase_price,
         _weight,
         _exp_dt
    FROM JSON_TO_RECORD(_js) AS s(  sku_id          INTEGER,
                                    sku_name        VARCHAR,
                                    unit            VARCHAR,
                                    qty             INTEGER,
                                    cake_decor_type VARCHAR,
                                    supplier_id     INTEGER,
                                    purchase_price  NUMERIC(8,2),
                                    weight          VARCHAR,
                                    exp_dt          INTEGER);

    IF NOT EXISTS (SELECT 1 FROM cakedecoration c WHERE c.sku_id = _sku_id) THEN
        _error = 'Не существует выбранного украшения для торта';
    END IF;
    IF _sku_id <= 0 OR _sku_id IS NULL THEN
        _error = 'Поле "Идентификатор товарной позиции" не должно быть пустым\n';
    END IF;
    IF _sku_name = '' THEN
        _error = 'Поле "Наименование товарной позиции" не должно быть пустым\n';
    END IF;
    IF _unit = '' THEN
        _error = 'Поле "Unit" не должно быть пустым\n';
    END IF;
    IF _cake_decor_type = '' THEN
        _error = 'Поле "Тип товарной позиции" не должно быть пустым\n';
    END IF;

    IF _error != '' THEN
        RAISE EXCEPTION '%' , _error;
    END IF;

    UPDATE cakedecoration SET
                     sku_name = COALESCE(_sku_name, sku_name),
                     unit = COALESCE(_unit, unit),
                     qty = COALESCE(_qty, qty),
                     cake_decor_type = COALESCE(_cake_decor_type, cake_decor_type),
                     purchase_price = COALESCE(_purchase_price, purchase_price),
                     weight = COALESCE(_weight, weight),
                     exp_dt = COALESCE(_exp_dt, exp_dt)
    WHERE sku_id = _sku_id;
END;
$$;
