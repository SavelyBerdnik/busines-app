package domain

type CakeDecorationsResponse struct {
	Data        []CakeDecorations
	Count       int64   `json:"count"`
	PurchaseSum float32 `json:"purchase_sum"`
}

type CakeDecorationsType struct {
	IngredientsName string `json:"cake_decor_type"`
}

type CakeDecorations struct {
	SkuID               int64   `json:"sku_id"`
	SkuName             string  `json:"sku_name"`
	Qty                 int64   `json:"qty"`
	Unit                string  `json:"unit"`
	PurchasePrice       float32 `json:"purchase_price"`
	SupplierID          int64   `json:"supplier_id"`
	SupplierName        string  `json:"supplier_name"`
	CakeDecorationsType string  `json:"cake_decor_type"`
	Edt                 int64   `json:"edt"`
	ExpDt               int64   `json:"exp_dt"`
}

type CakeDecorationsPages struct {
	SkuName     string `json:"sku_name"`
	Unit        string `json:"unit"`
	Qty         int    `json:"qty"`
	ExpDt       int64  `json:"exp_dt,omitempty"`
	ExpDtString string `json:"exp_date"`
}

type UpdateCakeDecorationRequest struct {
	SkuID         int64   `json:"sku_id"`
	SkuName       string  `json:"sku_name"`
	Unit          string  `json:"unit"`
	Qty           int64   `json:"qty"`
	CakeDecorType string  `json:"cake_decor_type"`
	SupplierID    int64   `json:"supplier_id"`
	PurchasePrice float64 `json:"purchase_price"`
	Weight        string  `json:"weight"`
	ExpDt         int64   `json:"exp_dt"`
}
