package handlers

import (
	"net/http"
	"strconv"
	"time"

	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type cakeDecorationsHandler struct {
	db repository.Driver
}

func NewCakeDecorationsHandler(db repository.Driver, router *gin.Engine) *cakeDecorationsHandler {
	handler := &cakeDecorationsHandler{
		db: db,
	}

	ingredients := router.Group("/cakedecorations")

	ingredients.GET("/get", handler.GetCakeDecorations)
	ingredients.GET("/get-types", handler.GetCakedeocrationTypes)
	ingredients.GET("/get-pages", handler.GetCakedeocrationPages)
	ingredients.GET("/get_with_filter", handler.GetFilteredCakeDecorations)
	ingredients.POST("/update", handler.UpdateCakeDecoration)
	ingredients.POST("/remove", handler.RemoveCakeDecorations)

	return handler
}

func (h *cakeDecorationsHandler) GetCakeDecorations(c *gin.Context) {
	dbResult, dbErr := h.db.ExecSP("get_cakedecorations")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var ingredients domain.CakeDecorationsResponse
	err := jsoniter.Unmarshal(dbResult, &ingredients)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	c.JSON(http.StatusOK, ingredients)
}

func (i *cakeDecorationsHandler) GetCakedeocrationTypes(c *gin.Context) {
	dbResult, dbErr := i.db.ExecSP("get_cakedecoration_types")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var cakedecorationTypes []domain.CakeDecorationsType
	err := jsoniter.Unmarshal(dbResult, &cakedecorationTypes)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	c.JSON(http.StatusOK, cakedecorationTypes)
}

func (i *cakeDecorationsHandler) GetCakedeocrationPages(c *gin.Context) {
	var (
		err        error
		page       int
		pageString = c.Query("page")
		ingType    = c.Query("type")
	)

	if pageString != "" {
		page, err = strconv.Atoi(pageString)
		if err != nil {
			c.JSON(http.StatusBadRequest, "page must be an integer")
		}
	}

	dbResult, dbErr := i.db.ExecSP("get_cakedecorations_pages", page, ingType)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var cakedecorations []domain.CakeDecorationsPages
	err = jsoniter.Unmarshal(dbResult, &cakedecorations)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	for i := range cakedecorations {
		date := time.Now().Add(time.Hour * 24 * time.Duration(cakedecorations[i].ExpDt)).Format(time.DateOnly)
		cakedecorations[i].ExpDtString = date
		cakedecorations[i].ExpDt = 0
	}

	c.JSON(http.StatusOK, cakedecorations)
}

func (h *cakeDecorationsHandler) GetFilteredCakeDecorations(c *gin.Context) {
	var dt = c.Query("dt")

	expDt, err := strconv.Atoi(dt)
	if err != nil {
		c.JSON(http.StatusBadRequest, "dt must be an integer")
	}

	dbResult, dbErr := h.db.ExecSP("get_cakedecorations_filter", expDt)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var ingredients domain.CakeDecorationsResponse
	err = jsoniter.Unmarshal(dbResult, &ingredients)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	c.JSON(http.StatusOK, ingredients)
}

func (h *cakeDecorationsHandler) UpdateCakeDecoration(c *gin.Context) {
	var req domain.UpdateCakeDecorationRequest

	if err := c.BindJSON(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("update_cakedecoration", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *cakeDecorationsHandler) RemoveCakeDecorations(c *gin.Context) {
	skuID := c.Query("id")

	_, dbErr := h.db.ExecSP("remove_cakedecorations", skuID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
