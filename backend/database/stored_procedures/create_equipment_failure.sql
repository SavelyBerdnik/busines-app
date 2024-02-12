CREATE OR REPLACE FUNCTION create_equipment_failure(_js JSON) RETURNS VOID
    LANGUAGE plpgsql AS
$$
DECLARE
    _reason      VARCHAR;
    _fail_time   INT;
    _fail_date   TIMESTAMP;
    _eqp_id      INT;
BEGIN
    SELECT reason,
           fail_time,
           now(),
           eqp_id
    INTO _reason,
         _fail_time,
         _fail_date,
         _eqp_id
    FROM JSON_TO_RECORD(_js) AS s(reason      VARCHAR,
                                  fail_time   INT,
                                  eqp_id      INT);

    INSERT INTO equipment_failure (reason, fail_time, fail_date, eqp_id)
    VALUES (_reason, _fail_time, _fail_date, _eqp_id);
END;
$$;
