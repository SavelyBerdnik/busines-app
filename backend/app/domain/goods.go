package domain

type GetGoodsResponse struct {
	GoodID           int64  `json:"good_id"`
	GoodsName        string `json:"goods_name"`
	GoodsDescription string `json:"goods_description"`
	Dimensions       string `json:"dimensions"`
}
