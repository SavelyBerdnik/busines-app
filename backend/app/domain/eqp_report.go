package domain

type EqpReport struct {
	EqpID        int    `json:"eqp_id"`
	EqpTitle     string `json:"eqp_title"`
	EqpTypeID    int    `json:"eqp_type_id"`
	EqpBuyDate   string `json:"eqp_buy_date"`
	Qty          int    `json:"qty"`
	SupplierID   int    `json:"supplier_id"`
	SupplierName string `json:"supplier_name"`
}

type EqpReportResp map[int][]EqpReport

func (a EqpReportResp) Len() int      { return len(a) }
func (a EqpReportResp) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a EqpReportResp) Less(i, j int) bool {
	sumI := 0
	sumJ := 0

	for x := range a[i] {
		sumI += a[i][x].Qty
	}

	for x := range a[j] {
		sumJ += a[j][x].Qty
	}

	return sumI >= sumJ
}
