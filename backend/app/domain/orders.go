package domain

import "mime/multipart"

type Orders []Order

type Order struct {
	ID               string   `json:"order_id"`
	OrderName        string   `json:"order_name"`
	OrderStatus      string   `json:"order_status"`
	Price            float32  `json:"price"`
	CustomerID       int64    `json:"customer_id"`
	CustomerName     string   `json:"customer_name"`
	EndDt            string   `json:"end_dt"`
	Dt               string   `json:"dt"`
	MangerID         int64    `json:"manager_id"`
	MangerName       string   `json:"manager_name"`
	GoodsDescription string   `json:"goods_description"`
	GoodID           int      `json:"good_id"`
	Dimensions       string   `json:"dimensions"`
	ImagePaths       []string `json:"image_paths"`
}

type CreateOrderRequest struct {
	CustomerID       int64                  `form:"customer_id" json:"customer_id"`
	ManagerID        int64                  `form:"manager_id" json:"manager_id"`
	OrderName        string                 `form:"order_name" json:"order_name"`
	GoodsDescription string                 `form:"goods_description" json:"goods_description"`
	GoodsDimensions  string                 `form:"goods_dimensions" json:"goods_dimensions"`
	OrderStatus      string                 `form:"order_status" json:"order_status"`
	Images           []multipart.FileHeader `form:"files"`
	ImagePaths       []string               `form:"image_paths" json:"image_paths"`
}

type EditOrderRequest struct {
	OrderID          string `json:"order_id"`
	OrderName        string `json:"order_name"`
	GoodsDescription string `json:"goods_description"`
	GoodsDimensions  string `json:"goods_dimensions"`
}

type SpecifyOrderRequest struct {
	OrderID string  `json:"order_id"`
	Price   float32 `json:"price"`
	EndDt   string  `json:"end_dt"`
}

type OrderLog struct {
	ID        int    `json:"id"`
	OrderID   string `json:"order_id"`
	NewStatus string `json:"new_status"`
	Dt        string `json:"dt"`
}
