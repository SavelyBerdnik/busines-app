package domain

type IngredientsResponse struct {
	Data        []Ingredients `json:"data"`
	Count       float32       `json:"count"`
	PurchaseSum float32       `json:"purchase_sum"`
}

type Ingredients struct {
	IngredientsID   int     `json:"ingredient_id"`
	IngredientsName string  `json:"ingredients_name"`
	Unit            string  `json:"unit"`
	PurchasePrice   float32 `json:"purchase_price"`
	SupplierID      int64   `json:"supplier_id"`
	SupplierName    string  `json:"supplier_name"`
	Qty             int     `json:"qty"`
	Edt             int64   `json:"edt"`
	ExpDt           int64   `json:"exp_dt"`
}

type IngredientsPages struct {
	IngredientsName string `json:"ingredients_name"`
	Unit            string `json:"unit"`
	Qty             int    `json:"qty"`
	ExpDt           int64  `json:"exp_dt,omitempty"`
	ExpDtString     string `json:"exp_date"`
}

type IngredientTypes struct {
	IngredientsName string `json:"ingredients_type"`
}

type UpdateIngredientRequest struct {
	IngredientsID   int64   `json:"ingredient_id"`
	IngredientsName string  `json:"ingredients_name,omitempty"`
	Unit            string  `json:"unit,omitempty"`
	Qty             int     `json:"qty"`
	SupplierID      int64   `json:"supplier_id,omitempty"`
	IngredientsType string  `json:"ingredients_type,omitempty"`
	PurchasePrice   float64 `json:"purchase_price,omitempty"`
	GOST            string  `json:"gost,omitempty"`
	Packaging       string  `json:"packaging,omitempty"`
	Characteristics string  `json:"characteristics,omitempty"`
	ExpDt           int64   `json:"exp_dt,omitempty"`
}
