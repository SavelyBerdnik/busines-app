package handlers

import (
	"crypto/rand"
	"math/big"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type ordersHandler struct {
	db repository.Driver
}

func NewOrdersHandler(db repository.Driver, router *gin.Engine, jwtService *domain.JWTService) *ordersHandler {
	var handler = &ordersHandler{
		db: db,
	}

	orders := router.Group("/orders")

	orders.GET("/get", AuthMiddleware(jwtService), handler.GetOrders)
	orders.GET("/logs", AuthMiddleware(jwtService), handler.GetLogs)
	orders.POST("/create", AuthMiddleware(jwtService), BindRole(db), handler.CreateOrder)
	orders.POST("/update", AuthMiddleware(jwtService), handler.UpdateOrder)
	orders.POST("/edit", AuthMiddleware(jwtService), handler.EditOrder)
	orders.POST("/take", AuthMiddleware(jwtService), BindRole(db), handler.TakeOrder)
	orders.POST("/specify", AuthMiddleware(jwtService), handler.SpecifyOrder)
	orders.POST("/cancel", AuthMiddleware(jwtService), BindRole(db), handler.CancelOrder)
	orders.POST("/remove", AuthMiddleware(jwtService), handler.RemoveOrder)

	return handler
}

func (o *ordersHandler) GetOrders(c *gin.Context) {
	uid := c.GetInt64("uid")
	status := c.Query("status")

	dbResult, dbErr := o.db.ExecSP("get_orders", uid, status)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var suppliers domain.Orders
	err := jsoniter.Unmarshal(dbResult, &suppliers)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	c.JSON(http.StatusOK, suppliers)
}

func (o *ordersHandler) UpdateOrder(c *gin.Context) {
	status := c.Query("status")
	order_id := c.Query("order_id")

	_, dbErr := o.db.ExecSP("update_order_status", order_id, status)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (o *ordersHandler) CreateOrder(c *gin.Context) {
	var req domain.CreateOrderRequest
	uid := c.GetInt64("uid")

	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	req.ImagePaths = make([]string, len(req.Images))
	for i := range req.Images {
		r, _ := rand.Int(rand.Reader, big.NewInt(10000000))
		req.Images[i].Filename = "work_examples/" + strconv.Itoa(int(r.Int64())) + req.Images[i].Filename
		req.ImagePaths[i] = req.Images[i].Filename
		saveImageFile(c, req.Images[i])
	}

	if len(req.Images) == 0 {
		req.ImagePaths = []string{"work_examples/no_image.jpg"}
	}

	role := c.GetString("role")
	if role == "client" {
		req.CustomerID = uid
		req.OrderStatus = "new"
	}
	if role == "client_manager" {
		req.ManagerID = uid
		req.OrderStatus = "specification"
	}

	_, dbErr := o.db.ExecSP("create_order", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *ordersHandler) RemoveOrder(c *gin.Context) {
	var orderID = c.Query("order_id")

	_, dbErr := h.db.ExecSP("remove_order", orderID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *ordersHandler) CancelOrder(c *gin.Context) {
	var req struct {
		OrderID string `json:"order_id"`
		Reason  string `json:"reason"`
	}

	req.OrderID = c.Query("order_id")
	req.Reason = c.Query("reason")

	role := c.GetString("role")
	if role == "client" {
		req.Reason = "Order was canceled by the client"
	}

	_, dbErr := h.db.ExecSP("update_order_cancel", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *ordersHandler) TakeOrder(c *gin.Context) {
	orderID := c.Query("order_id")

	managerID := c.GetInt64("uid")

	_, dbErr := h.db.ExecSP("update_order_take", orderID, managerID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *ordersHandler) EditOrder(c *gin.Context) {
	var req domain.EditOrderRequest

	if err := c.BindJSON(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("update_order_edit", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *ordersHandler) SpecifyOrder(c *gin.Context) {
	var req domain.SpecifyOrderRequest

	if err := c.BindJSON(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("update_order_specify", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *ordersHandler) GetLogs(c *gin.Context) {
	var res []domain.OrderLog

	dbResult, dbErr := h.db.ExecSP("get_order_logs")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}
	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
	}

	err := jsoniter.Unmarshal(dbResult, &res)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	c.JSON(http.StatusOK, res)
}
