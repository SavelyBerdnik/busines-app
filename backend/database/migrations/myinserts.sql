INSERT INTO public.users (id,
                          login,
                          password,
                          role,
                          full_name,
                          image_path)
VALUES (1, '1', '1', 'purchase_manager', 'Соколов Владислав', 'mock-image.jpg'),
       (2, '2', '1', 'master', 'Коршунов Даниил', 'mock-image.jpg'),
       (3, '3', '1', 'client', 'Важнов Клиентин', 'mock-image.jpg'),
       (4, '4', '1', 'client_manager', 'Платонов Марин', 'mock-image.jpg'),
       (5, '5', '1', 'director', 'Савелий Бердников', 'mock-image.jpg')
ON CONFLICT (id) DO UPDATE
SET id=excluded.id,
  login=excluded.login,
  password=excluded.password,
  role=excluded.role,
  full_name=excluded.full_name,
  image_path=excluded.image_path;

ALTER SEQUENCE users_id_seq RESTART WITH 1001;

INSERT INTO public.equipmenttypes (eqp_type_id,
                                   eqp_type_name)
VALUES (1, 'Нож'),
       (2, 'Миксер'),
       (3, 'Блендер'),
       (4, 'Печка'),
       (5, 'Плита'),
       (6, 'Сковородка'),
       (7, 'Поварешка'),
       (8, 'Гриль')
ON CONFLICT DO NOTHING;


INSERT INTO public.suppliers (supplier_name,
                              address,
                              edt)
VALUES ('Важнов Поставщук', 'Москва, Калужская, 12', 3600),
    ('Поставщиков Генадич', 'Рязань, Дмитровская, 3', 4800),
    ('Постафья Ивановна', 'Калуга, Соколиная, 4', 2800),
    ('Наталья Поставщук', 'Питер, Красная, 25', 7200)
ON CONFLICT DO NOTHING ;


INSERT INTO public.equipment (eqp_title,
                              eqp_descr,
                              eqp_type_id,
                              eqp_wear,
                              eqp_supplier,
                              eqp_buy_date,
                              eqp_qty)
VALUES ('Horizon', 'Классный ножик', 1, 10, 1, '2023-12-18', 10),
    ('Печка 3000', 'Офигеть', 4, 5, 2, '2023-12-18', 2),
    ('Миксер 3000', 'Миксует', 2, 15, 3, '2023-12-18', 2),
    ('Блендер 3000', 'Блендерит', 3, 20, 4, '2023-12-18', 2),
    ('Сковородка модная', 'НУЖНА ЧТОБЫ ЖАРИТЬ', 6, 15, 1, '2023-12-18', 2),
    ('Поварешка', 'Для настоящего повора', 7, 20, 2, '2023-12-18', 2),
    ('Гриль 3000', 'Грилит', 8, 15, 4, '2023-12-18', 2),
    ('Плита 3000', 'Пекет', 5, 10, 3, '2023-12-18', 2)
ON CONFLICT DO NOTHING;


INSERT INTO public.goods (goods_name,
                          dimensions,
                          goods_description,
                          operation_sequence)
VALUES ('Торт',
        '30x20x10',
        'Классный торт',
        '1. Сделайте это 2. Сделайте то');

DELETE FROM public.specificationsemifinished ssf WHERE ssf.good_id=1 and ssf.semifinished='Варенная картошка';
DELETE FROM public.specificationingredients WHERE ingredient_id=1 and good_id=1;
DELETE FROM public.ingredients WHERE ingredient_id=1;
INSERT INTO public.ingredients (ingredient_id, ingredients_name, unit, qty, supplier_id, ingredients_type, purchase_price, gost, packaging, characteristics, exp_dt)
VALUES (1, 'Глазурь кондитерская Блиссо дропсы  03-14', 'кг.', 10, null, 'Шоколад', null, null, null, null, null)
;
INSERT INTO public.specificationingredients (good_id, ingredient_id, qty) VALUES (1, 1, 2);

DELETE FROM public.specificationcakedecoration WHERE sku_id=1 and good_id=1;
DELETE FROM public.cakedecoration WHERE sku_id=1;

INSERT INTO public.cakedecoration (sku_id, sku_name, unit, qty, cake_decor_type, supplier_id, purchase_price, weight, exp_dt)
VALUES (1, 'Какао алкализован. POR10G9 Франция', 'кг.', 7, 'Какао', null, null, null, null);

INSERT INTO public.specificationcakedecoration (good_id, sku_id, qty) VALUES (1, 1, 2)
ON CONFLICT DO NOTHING;



INSERT INTO public.specificationsemifinished (semifinished_id, good_id, semifinished, qty)
VALUES (1, 1, 'Варенная картошка', 2) ON CONFLICT DO NOTHING;
ALTER SEQUENCE specificationsemifinished_semifinished_id_seq RESTART WITH 2;

INSERT INTO public.semifinished_ingredients (semifinished_id, ingredient_id, qty) VALUES (1, 1, 2)
ON CONFLICT DO NOTHING;

INSERT INTO public.orders (order_id,
                           good_id,
                           dt,
                           order_name,
                           customer_id,
                           manager_id,
                           price,
                           end_dt,
                           order_status,
                           work_examples_id)
VALUES ('14062003ВС01',
        1,
        '2023-12-22 02:43:03.000000',
        'Заказ Класс',
        3,
        NULL,
        1000.00,
        '2023-12-22',
        'new',
        1)
ON CONFLICT DO NOTHING;

INSERT INTO public.order_logs (order_id, new_status, dt) VALUES ('14062003ВС01', 'new', now());

INSERT INTO public.work_examples (work_example_id, image_path) VALUES (1, 'work_examples/no_image.jpg');

INSERT INTO equipment_report (supplier_id, eqp_id, qty)
VALUES (1, 1, 8),
       (2, 2, 4),
       (3, 3, 6),
       (4, 4, 3),
       (1, 5, 20),
       (2, 6, 3),
       (3, 7, 15),
       (4, 8, 12),
       (2, 1, 4),
       (4, 2, 19),
       (2, 3, 14),
       (3, 4, 10),
       (4, 5, 4),
       (1, 6, 5)
ON CONFLICT DO NOTHING;

UPDATE ingredients
SET exp_dt=floor(random() * 80 + 1)::int,
    supplier_id=floor(random() * 4 + 1)::int
WHERE TRUE;

UPDATE cakedecoration
SET exp_dt=floor(random() * 80 + 1)::int,
    supplier_id=floor(random() * 4 + 1)::int
WHERE TRUE;
