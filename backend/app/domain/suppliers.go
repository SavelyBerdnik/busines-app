package domain

type SupplierResponse []struct {
	SupplierID   int64  `json:"supplier_id"`
	SupplierName string `json:"supplier_name"`
	Address      string `json:"address"`
	Edt          int64  `json:"edt"`
}
