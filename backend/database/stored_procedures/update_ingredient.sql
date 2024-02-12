CREATE OR REPLACE FUNCTION update_ingredient(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _ingredient_id   INTEGER;
    _ingredients_name VARCHAR;
    _unit             VARCHAR;
    _supplier_id      INTEGER;
    _ingredients_type VARCHAR;
    _purchase_price   NUMERIC(8,2);
    _gost             VARCHAR;
    _packaging        VARCHAR;
    _characteristics  VARCHAR;
    _exp_dt           INTEGER;
    _qty              INTEGER;

    _error            VARCHAR;
BEGIN
    SELECT  ingredient_id,
            ingredients_name,
            unit,
            supplier_id,
            ingredients_type,
            purchase_price,
            gost,
            packaging,
            characteristics,
            exp_dt,
            qty
    INTO _ingredient_id,
         _ingredients_name,
         _unit,
         _supplier_id,
         _ingredients_type,
         _purchase_price,
         _gost,
         _packaging,
         _characteristics,
         _exp_dt,
         _qty
    FROM JSON_TO_RECORD(_js) AS s(  ingredient_id   INTEGER,
                                    ingredients_name VARCHAR,
                                    unit             VARCHAR,
                                    supplier_id      INTEGER,
                                    ingredients_type VARCHAR,
                                    purchase_price   NUMERIC(8,2),
                                    gost             VARCHAR,
                                    packaging        VARCHAR,
                                    characteristics  VARCHAR,
                                    exp_dt           INTEGER,
                                    qty              INTEGER);

    IF NOT EXISTS (SELECT 1 FROM ingredients i WHERE i.ingredient_id = _ingredient_id) THEN
        _error = 'Не существует выбранного ингредиента';
    END IF;
    IF _ingredient_id <= 0 OR _ingredient_id IS NULL THEN
        _error = 'Поле "Идентификатор ингредиента" не должно быть пустым\n';
    END IF;
    IF _ingredients_name = '' THEN
        _error = 'Поле "Наименование ингредиента" не должно быть пустым\n';
    END IF;

    IF _error != '' THEN
        RAISE EXCEPTION '%' , _error;
    END IF;

    UPDATE ingredients SET
                     ingredients_name = COALESCE(_ingredients_name, ingredients_name),
                     unit = COALESCE(_unit, unit),
                     supplier_id = COALESCE(_supplier_id, supplier_id),
                     ingredients_type = COALESCE(_ingredients_type, ingredients_type),
                     purchase_price = COALESCE(_purchase_price, purchase_price),
                     gost = COALESCE(_gost, gost),
                     packaging = COALESCE(_packaging, packaging),
                     characteristics = COALESCE(_characteristics, characteristics),
                     exp_dt = COALESCE(_exp_dt, exp_dt),
                     qty = COALESCE(_qty, qty)
    WHERE ingredient_id = _ingredient_id;
END;
$$;