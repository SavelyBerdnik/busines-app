CREATE OR REPLACE FUNCTION create_eqp(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _eqp_title    VARCHAR;
    _eqp_descr    VARCHAR;
    _eqp_type_id  INTEGER;
    _eqp_wear     INTEGER;
    _eqp_supplier   INTEGER;
    _eqp_buy_date DATE;
    _eqp_qty      INTEGER;

    _error        VARCHAR;
BEGIN
    SELECT eqp_title,
           eqp_descr,
           eqp_type_id,
           eqp_wear,
           eqp_supplier,
           eqp_buy_date,
           eqp_qty
    INTO _eqp_title,
         _eqp_descr,
         _eqp_type_id,
         _eqp_wear,
         _eqp_supplier,
         _eqp_buy_date,
         _eqp_qty
    FROM JSON_TO_RECORD(_js) AS s(eqp_title    VARCHAR,
                                  eqp_descr    VARCHAR,
                                  eqp_type_id  INTEGER,
                                  eqp_wear     INTEGER,
                                  eqp_supplier INTEGER,
                                  eqp_buy_date DATE,
                                  eqp_qty      INTEGER);

    IF NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.supplier_id = _eqp_supplier) THEN
        _error = 'Не существует выбранного поставщика';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM equipmenttypes WHERE eqp_type_id = _eqp_type_id) THEN
        _error = 'Не существует выбранного типа инструмента';
    end if;

    IF _eqp_wear < 0 OR _eqp_wear > 100 THEN
        _error = _error || 'Поле "Степень износа" должно быть в пределах от 0% до 100%\n';
    END IF;
    IF _eqp_title = '' THEN
        _error = _error || 'Поле "Наименование" не может быть пустым\n';
    END IF;
    IF _eqp_descr = '' THEN
        _error = _error || 'Поле "Описание" не может быть пустым\n';
    END IF;
    IF _eqp_type_id = 0 THEN
        _error = _error || 'Поле "Тип инструмента" не может быть пустым\n';
    END IF;
    IF _eqp_wear = 0 THEN
        _error = _error || 'Поле "Степень износа" не может быть пустым\n';
    END IF;
    IF _eqp_supplier = 0 THEN
        _error = _error || 'Поле "Поставщик" не может быть пустым\n';
    END IF;
    IF _eqp_buy_date::VARCHAR !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN
        _error = _error || 'Некорректная дата приобретения\n';
    END IF;
    IF _eqp_qty = 0 THEN
        _error = _error || 'Поле "Количенство инструментов" не может быть пустым\n';
    END IF;

    IF _error != '' THEN
        RAISE EXCEPTION '%' , _error;
    END IF;

    INSERT INTO equipment(eqp_title,
                          eqp_descr,
                          eqp_type_id,
                          eqp_wear,
                          eqp_supplier,
                          eqp_buy_date,
                          eqp_qty)
    VALUES (_eqp_title,
            _eqp_descr,
            _eqp_type_id,
            _eqp_wear,
            _eqp_supplier,
            _eqp_buy_date,
            _eqp_qty);
END;
$$;
