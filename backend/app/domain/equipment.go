package domain

type CreateEquipmentRequest struct {
	EqpTitle    string `json:"eqp_title"`
	EqpDescr    string `json:"eqp_descr"`
	EqpTypeID   int64  `json:"eqp_type_id"`
	EqpWear     int64  `json:"eqp_wear"`
	EqpSupplier int64  `json:"eqp_supplier"`
	EqpBuyDate  string `json:"eqp_buy_date"`
	EqpQty      int64  `json:"eqp_qty"`
}

type UpdateEquipmentRequest struct {
	EqpID       int64  `json:"eqp_id"`
	EqpTitle    string `json:"eqp_title"`
	EqpDescr    string `json:"eqp_descr"`
	EqpTypeID   int64  `json:"eqp_type_id"`
	EqpWear     int64  `json:"eqp_wear"`
	EqpSupplier int64  `json:"eqp_supplier"`
	EqpBuyDate  string `json:"eqp_buy_date"`
	EqpQty      int64  `json:"eqp_qty"`
}

type GetEquipmentResponse struct {
	EqpID      int64  `json:"eqp_id"`
	EqpTitle   string `json:"eqp_title"`
	EqpTypeID  int64  `json:"eqp_type_id"`
	EqpBuyDate string `json:"eqp_buy_date"`
	Age        int64  `json:"age"`
	EqpQty     int64  `json:"eqp_qty"`
}

type GetEquipmentTypesResponse []struct {
	EqpTypeID   int64  `json:"eqp_type_id"`
	EqpTypeName string `json:"eqp_type_name"`
}

type CreateEquipmentFailure struct {
	EqpID    int    `json:"eqp_id"`
	FailTime int    `json:"fail_time"`
	FailDate string `json:"fail_date"`
	Reason   string `json:"reason"`
}

type EquipmentFailureDiag struct {
	FailTime int    `json:"sum_fail_time"`
	Reason   string `json:"reason"`
}
