CREATE OR REPLACE FUNCTION create_specification_semifinished(_js JSON) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _goods_id INT;
    _res JSON;
BEGIN
    SELECT s.good_id
    INTO _goods_id
    FROM JSON_TO_RECORDSET(_js) AS s(good_id        bigint)
    LIMIT 1;

    DELETE FROM specificationsemifinished scd
    WHERE scd.good_id=_goods_id;

    WITH cte AS (SELECT si.semifinished_id
                FROM semifinished_ingredients si
                    LEFT JOIN specificationsemifinished ssf ON si.semifinished_id=ssf.semifinished_id
                WHERE ssf.semifinished_id IS NULL)
    DELETE FROM semifinished_ingredients si
    USING cte
    WHERE si.semifinished_id IN (SELECT si.semifinished_id FROM cte);


    WITH ins_semifs AS (
        SELECT s.good_id,
               s.semif_ings,
               s.qty,
               s.semifinished
        FROM JSON_TO_RECORDSET(_js) AS s(good_id        bigint,
                                         semif_ings    JSON,
                                         qty            smallint,
                                         semifinished   VARCHAR)
        ),
    ins_res AS (
            INSERT INTO specificationsemifinished (good_id, semifinished, qty)
            SELECT c.good_id,
                   c.semifinished,
                   c.qty
            FROM ins_semifs c
            RETURNING semifinished_id, semifinished
        ),
    ins_ings AS (
        SELECT ir.semifinished_id, ist.semif_ings
        FROM ins_res ir
        LEFT JOIN ins_semifs ist
        ON ist.semifinished=ir.semifinished
    )

    INSERT INTO semifinished_ingredients (semifinished_id, ingredient_id, qty)

    SELECT  ii.semifinished_id, som.ingredient_id, som.qty
          FROM ins_ings ii
          CROSS JOIN LATERAL (SELECT *
                FROM json_to_recordset(ii.semif_ings)
                AS s(ingredient_id INT,
                     qty           INT)) som;

    RETURN _res;
END;
$$;


select create_specification_semifinished('
[
    {
        "good_id": 1,
        "semif_ings": [{
          "ingredient_id": 12,
          "qty": 10
        },
        {
          "ingredient_id": 10,
          "qty": 20
        }],
        "qty": 1,
        "semifinished": "Морковь"
    },
    {
        "good_id": 1,
        "semif_ings": [{
          "ingredient_id": 3,
          "qty": 5
        },
        {
          "ingredient_id": 4,
          "qty": 6
        }],
        "qty": 1,
        "semifinished": "Рис"
    },
        {
        "good_id": 1,
        "semif_ings": [{
          "ingredient_id": 3,
          "qty": 5
        },
        {
          "ingredient_id": 4,
          "qty": 6
        }],
        "qty": 1,
        "semifinished": "Гречка"
    },
        {
        "good_id": 1,
        "semif_ings": [{
          "ingredient_id": 3,
          "qty": 5
        },
        {
          "ingredient_id": 4,
          "qty": 6
        }],
        "qty": 1,
        "semifinished": "Суп"
    }
]
')
