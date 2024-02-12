package handlers

import (
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
	"net/http"
)

type goodsHandler struct {
	db repository.Driver
}

func NewGoodsHandler(db repository.Driver, router *gin.Engine) *goodsHandler {
	handler := &goodsHandler{
		db: db,
	}

	ingredients := router.Group("/goods")

	ingredients.GET("/get", handler.GetGoods)

	return handler
}

func (h *goodsHandler) GetGoods(c *gin.Context) {
	dbResult, dbErr := h.db.ExecSP("get_goods")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var goods []domain.GetGoodsResponse
	err := jsoniter.Unmarshal(dbResult, &goods)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	c.JSON(http.StatusOK, goods)
}
