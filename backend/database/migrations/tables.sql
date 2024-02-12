CREATE TABLE IF NOT EXISTS public.users
(
    id            BIGSERIAL    NOT NULL,
    login         VARCHAR      NOT NULL UNIQUE,
    password      VARCHAR      NOT NULL,
    role          VARCHAR      NOT NULL,
    full_name     VARCHAR      NOT NULL,
    image_path    VARCHAR      NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS public.suppliers
(
    supplier_id   BIGSERIAL    NOT NULL,
    supplier_name VARCHAR      NOT NULL,
    address       VARCHAR      NOT NULL,
    edt           SMALLINT     NOT NULL,
    CONSTRAINT pk_suppliers PRIMARY KEY(supplier_id)
);


CREATE TABLE IF NOT EXISTS public.equipmenttypes
(
    eqp_type_id   INTEGER      NOT NULL UNIQUE,
    eqp_type_name VARCHAR      NOT NULL,
    CONSTRAINT pk_equipmenttypes PRIMARY KEY(eqp_type_id)
);


CREATE TABLE IF NOT EXISTS public.equipment
(
    eqp_id       BIGSERIAL     NOT NULL,
    eqp_title    VARCHAR       NOT NULL UNIQUE,
    eqp_descr    VARCHAR       NOT NULL,
    eqp_type_id  INTEGER       NOT NULL,
    eqp_wear     INTEGER       NOT NULL,
    eqp_supplier INTEGER       NOT NULL,
    eqp_buy_date DATE          NOT NULL,
    eqp_qty      INTEGER       NOT NULL,
    CONSTRAINT pk_equipment PRIMARY KEY(eqp_id),
    CONSTRAINT fk_equipment_equipmenttypes FOREIGN KEY (eqp_type_id) REFERENCES public.equipmenttypes(eqp_type_id),
    CONSTRAINT fk_equipment_users FOREIGN KEY (eqp_supplier) REFERENCES public.suppliers(supplier_id)
);


CREATE TABLE IF NOT EXISTS public.ingredients
(
    ingredient_id   BIGSERIAL        NOT NULL,
    ingredients_name VARCHAR          NOT NULL,
    unit             VARCHAR,
    qty              INT              DEFAULT 0,
    supplier_id      INTEGER,
    ingredients_type VARCHAR,
    purchase_price   DECIMAL(8,2),
    GOST             VARCHAR,
    packaging        VARCHAR,
    characteristics  VARCHAR,
    exp_dt           SMALLINT,
    CONSTRAINT pk_ingredients PRIMARY KEY(ingredient_id),
    CONSTRAINT kf_suppliers_ingredients FOREIGN KEY(supplier_id) REFERENCES public.suppliers(supplier_id)
);


CREATE TABLE IF NOT EXISTS public.cakedecoration
(
    sku_id          BIGSERIAL        NOT NULL,
    sku_name        VARCHAR          NOT NULL,
    unit            VARCHAR          NOT NULL,
    qty             INTEGER          NOT NULL,
    cake_decor_type VARCHAR          NOT NULL,
    supplier_id     INTEGER,
    purchase_price  DECIMAL(8,2),
    weight          VARCHAR,
    exp_dt          SMALLINT,
    CONSTRAINT pk_cakedecoration PRIMARY KEY(sku_id),
    CONSTRAINT kf_suppliers_cakedecoration FOREIGN KEY(supplier_id) REFERENCES public.suppliers(supplier_id)
);


CREATE TABLE IF NOT EXISTS public.goods
(
    good_id            BIGSERIAL   NOT NULL,
    goods_name         VARCHAR     NOT NULL,
    goods_description  VARCHAR     NOT NULL,
    dimensions         VARCHAR     NOT NULL,
    operation_sequence VARCHAR     NOT NULL,
    CONSTRAINT pk_goods PRIMARY KEY(good_id)
);


CREATE TABLE IF NOT EXISTS public.specificationcakedecoration
(
    good_id         BIGINT   NOT NULL,
    sku_id          INTEGER  NOT NULL,
    qty             SMALLINT NOT NULL,
    CONSTRAINT pk_specificationcakedecoration PRIMARY KEY(good_id, sku_id),
    CONSTRAINT fk_specificationcakedecoration_goods FOREIGN KEY (good_id) REFERENCES public.goods(good_id),
    CONSTRAINT fk_specificationcakedecoration_ingredients FOREIGN KEY (sku_id) REFERENCES public.cakedecoration(sku_id)
);


CREATE TABLE IF NOT EXISTS public.specificationsemifinished
(
    semifinished_id BIGSERIAL NOT NULL,
    good_id         BIGINT   NOT NULL,
    semifinished    VARCHAR  NOT NULL,
    qty             SMALLINT NOT NULL,
    CONSTRAINT pk_specificationsemifinished PRIMARY KEY(good_id, semifinished),
    CONSTRAINT fk_specificationsemifinished_goods FOREIGN KEY (good_id) REFERENCES public.goods(good_id)
);


CREATE TABLE IF NOT EXISTS public.semifinished_ingredients (
    semifinished_id BIGINT NOT NULL,
    ingredient_id   BIGINT NOT NULL,
    qty             INT NOT NULL,
    CONSTRAINT pk_semifinished_ingredients PRIMARY KEY (semifinished_id, ingredient_id)
);


CREATE TABLE IF NOT EXISTS public.specificationingredients
(
    good_id        BIGINT   NOT NULL,
    ingredient_id INTEGER  NOT NULL,
    qty            SMALLINT NOT NULL,
    CONSTRAINT pk_specificationingredients PRIMARY KEY(good_id, ingredient_id),
    CONSTRAINT fk_specificationingredients_ingredients FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(ingredient_id),
    CONSTRAINT fk_specificationingredients_goods FOREIGN KEY (good_id) REFERENCES public.goods(good_id)
);


CREATE TABLE IF NOT EXISTS public.orders
(
    order_id      VARCHAR      NOT NULL PRIMARY KEY,
    good_id       BIGINT,
    dt            TIMESTAMP    NOT NULL,
    order_name    VARCHAR      NOT NULL,
    customer_id   INTEGER      NOT NULL,
    manager_id    INTEGER,
    price         DECIMAL(8,2),
    end_dt        DATE,
    order_status  VARCHAR      NOT NULL,
    work_examples_id INT,
    CONSTRAINT fk_orders_goods FOREIGN KEY (good_id) REFERENCES public.goods (good_id),
    CONSTRAINT fk_orders_customer_id FOREIGN KEY (customer_id) REFERENCES public.users(id),
    CONSTRAINT fk_orders_manager_id FOREIGN KEY (manager_id) REFERENCES public.users(id)
);

CREATE TABLE IF NOT EXISTS public.specificationoperations
(
    operation_id  BIGSERIAL   NOT NULL  PRIMARY KEY,
    goods_id       BIGINT      NOT NULL,
    operation      VARCHAR     NOT NULL,
    eqp_type_id    INT         NOT NULL,
    op_time        INT         NOT NULL,
    operation_seq  INT         NOT NULL,
    semif          VARCHAR     NOT NULL,
    CONSTRAINT fk_specificationoperations_goods FOREIGN KEY (goods_id) REFERENCES public.goods (good_id),
    CONSTRAINT fk_specificationoperations_equipmenttypes FOREIGN KEY (eqp_type_id) REFERENCES public.equipmenttypes (eqp_type_id)
);



-- OTHERS

CREATE TABLE IF NOT EXISTS public.order_logs
(
    id         SERIAL  PRIMARY KEY NOT NULL,
    order_id   VARCHAR NOT NULL,
    new_status VARCHAR NOT NULL,
    dt         TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.work_examples
(
    id SERIAL PRIMARY KEY,
    work_example_id INT NOT NULL,
    image_path VARCHAR
);

CREATE TABLE IF NOT EXISTS public.declined_orders_reasons
(
    order_id VARCHAR NOT NULL,
    reason VARCHAR
);

CREATE TABLE IF NOT EXISTS public.equipment_report
(
    supplier_id INT NOT NULL,
    eqp_id      INT NOT NULL,
    qty         INT NOT NULL,
    CONSTRAINT pk_equipment_report PRIMARY KEY(supplier_id, eqp_id),
    CONSTRAINT fk_equipment_report_eqp_id FOREIGN KEY (eqp_id) REFERENCES public.equipment (eqp_id),
    CONSTRAINT fk_equipment_report_supplier_id FOREIGN KEY (supplier_id) REFERENCES public.suppliers (supplier_id)
);

CREATE TABLE IF NOT EXISTS public.equipment_failure
(
    id          SERIAL  PRIMARY KEY   NOT NULL,
    reason      VARCHAR    NOT NULL,
    fail_time   INT        NOT NULL,
    fail_date   TIMESTAMP  NOT NULL,
    eqp_id      INT        NOT NULL,
    CONSTRAINT fk_equipment_failure_eqp_id FOREIGN KEY (eqp_id) REFERENCES public.equipment (eqp_id)
);