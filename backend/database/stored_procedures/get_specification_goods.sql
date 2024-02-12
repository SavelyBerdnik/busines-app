CREATE OR REPLACE FUNCTION get_specification_goods(_good_id INT) RETURNS JSON
    LANGUAGE plpgsql AS
$$
DECLARE
    _ings JSON;
    _decs JSON;
    _semifs JSON;
    _res JSON;
    _goods_opers JSON;
    _goods_name VARCHAR;
    _operation_seq VARCHAR;
    _dimensions VARCHAR;
BEGIN
    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _ings
    FROM (SELECT si.qty,
                 si.ingredient_id,
                 si.good_id,
                 i.ingredients_name,
                 i.unit
          FROM public.specificationingredients si
            LEFT JOIN ingredients i ON i.ingredient_id = si.ingredient_id
          WHERE si.good_id=_good_id) res;

    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _semifs
    FROM (SELECT ssf.semifinished_id,
                   ssf.good_id,
                   ssf.semifinished,
                   ssf.qty,
                   json_agg(json_build_object('ingredient_id', i.ingredient_id, 'ingredients_name', i.ingredients_name, 'qty', semi_ing.qty, 'unit', i.unit)) semif_ings,
                   json_agg(json_build_object('operation_id', so.operation_id, 'operation', so.operation, 'op_time', so.op_time, 'eqp_type_name', et.eqp_type_name)) opers
          FROM public.specificationsemifinished ssf
           LEFT JOIN LATERAL (SELECT * FROM semifinished_ingredients si WHERE si.semifinished_id =  ssf.semifinished_id) semi_ing ON semi_ing.semifinished_id=ssf.semifinished_id
           LEFT JOIN ingredients i ON semi_ing.ingredient_id=i.ingredient_id
           LEFT JOIN LATERAL (SELECT * FROM specificationoperations so WHERE so.goods_id = _good_id AND so.semif = ssf.semifinished) so ON TRUE
           LEFT JOIN equipmenttypes et ON et.eqp_type_id = so.eqp_type_id
          WHERE ssf.good_id=_good_id
         GROUP BY (ssf.good_id, ssf.semifinished_id, ssf.semifinished)) res;

    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _decs
    FROM (SELECT scd.qty,
                 scd.sku_id,
                 scd.good_id,
                 d.sku_name,
                 d.unit
          FROM public.specificationcakedecoration scd
            LEFT JOIN cakedecoration d ON scd.sku_id = d.sku_id
          WHERE scd.good_id=_good_id) res;

    SELECT JSON_AGG(ROW_TO_JSON(res))
    INTO _goods_opers
    FROM (SELECT so.operation_id,
                 so.operation,
                 et.eqp_type_name,
                 so.eqp_type_id,
                 so.op_time
          FROM specificationoperations so
          LEFT JOIN equipmenttypes et ON et.eqp_type_id = so.eqp_type_id
          WHERE so.semif = '' AND so.goods_id = _good_id
          ORDER BY so.operation_seq) res;

    SELECT g.goods_name,
           g.operation_sequence,
           g.dimensions
    INTO _goods_name,
         _operation_seq,
         _dimensions
    FROM goods g
    WHERE g.good_id = _good_id;

    SELECT JSON_BUILD_OBJECT('ings', _ings, 'decs', _decs, 'semifs', _semifs, 'opers', _goods_opers, 'good_name', _goods_name, 'operation_seq', _operation_seq, 'dimension', _dimensions)
    INTO _res;



    -- ВКЛЮЧИТЬ ОПЕРАЦИИ И ПРОЧЕЕ

    RETURN JSON_BUILD_OBJECT('data', _res, 'semifs', _semifs);
END;
$$;
select get_specification_goods(2);