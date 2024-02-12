package domain

type CreateDecorationSpecification struct {
	GoodID int `json:"good_id"`
	SkuID  int `json:"sku_id"`
	Qty    int `json:"qty"`
}

type CreateIngredientSpecification struct {
	GoodID       int `json:"good_id"`
	IngredientID int `json:"ingredient_id"`
	Qty          int `json:"qty"`
}

type CreateIngredientSpecification1 struct {
	GoodID       int `json:"good_id"`
	IngredientID int `json:"ingredient_id"`
	Qty          int `json:"qty"`
}

type CreateSemifinishedSpecification struct {
	GoodID       int       `json:"good_id"`
	Semifinished string    `json:"semifinished"`
	Qty          int       `json:"qty"`
	Ingredients  []SemiIng `json:"semif_ings"`
}

type SemiIng struct {
	IngredientID int `json:"ingredient_id"`
	Qty          int `json:"qty"`
}

type CreateSpecification struct {
	GoodID            int    `json:"good_id"`
	Dimensions        string `json:"dimensions"`
	OperationSequence string `json:"operation_sequence"`
}

type FinishSpecification struct {
	GoodID            int    `json:"good_id"`
	Dimensions        string `json:"dimensions"`
	OperationSequence string `json:"operation_sequence"`
}

type GetSpecificationGoodsResponse struct {
	Ings         []IngredientSpecificationForGoods `json:"ings"`
	Decs         []DecorationSpecificationForGoods `json:"decs"`
	Semifs       []SemifsSpecificationForGoods     `json:"semifs"`
	Opers        []Opers                           `json:"opers"`
	GoodName     string                            `json:"good_name"`
	OperationSeq string                            `json:"operation_seq"`
	Dimension    string                            `json:"dimension"`
}

type DecorationSpecificationForGoods struct {
	SkuName string `json:"sku_name"`
	Unit    string `json:"unit"`
	Qty     int    `json:"qty"`
}

type DecorationSpecification struct {
	SkuID  int `json:"sku_id"`
	GoodID int `json:"good_id"`
	Qty    int `json:"qty"`
}

type Opers struct {
	OperationID  int64  `json:"operation_id"`
	Operation    string `json:"operation"`
	EqpTypeName  string `json:"eqp_type_name"`
	OpTime       int64  `json:"op_time"`
	OperationSeq int64  `json:"operation_seq,omitempty"`
	Semif        string `json:"semif,omitempty"`
}

type IngredientSpecificationForGoods struct {
	IngredientName string `json:"ingredients_name"`
	Unit           string `json:"unit"`
	Qty            int    `json:"qty"`
}

type IngredientSpecificationGet struct {
	IngredientID int64 `json:"ingredient_id"`
	Qty          int   `json:"qty"`
	GoodsID      int   `json:"good_id"`
}

type SemifsSpecification struct {
	GoodID       int                                `json:"good_id"`
	Semifinished string                             `json:"semifinished"`
	Qty          int                                `json:"qty"`
	Ings         []IngredientSpecificationForSemifs `json:"semif_ings"`
	Opers        []Opers                            `json:"opers"`
}

type SemifsSpecificationForGoods struct {
	Semifinished string `json:"semifinished"`
	Qty          int    `json:"qty"`
}

type IngredientSpecificationForSemifs struct {
	IngredientID   int64  `json:"ingredient_id"`
	IngredientName string `json:"ingredients_name"`
	Unit           string `json:"unit"`
	Qty            int    `json:"qty"`
}

type OperationSpecification struct {
	OperationID  int64  `json:"operation_id"`
	GoodsID      int64  `json:"goods_id"`
	Operation    string `json:"operation"`
	EqpTypeID    int64  `json:"eqp_type_id"`
	OpTime       int    `json:"op_time"`
	Semif        string `json:"semif"`
	OperationSeq int    `json:"operation_seq"`
}
