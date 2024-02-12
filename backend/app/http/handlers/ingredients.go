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

type ingredientsHandler struct {
	db repository.Driver
}

func NewIngredientsHandler(db repository.Driver, router *gin.Engine) *ingredientsHandler {
	handler := &ingredientsHandler{
		db: db,
	}

	ingredients := router.Group("/ingredients")

	ingredients.GET("/get", handler.GetIngredients)
	ingredients.GET("/get-types", handler.GetIngredientsTypes)
	ingredients.GET("/get-pages", handler.GetIngredientsPages)
	ingredients.GET("/get_with_filter", handler.GetFilteredIngredients)
	ingredients.POST("/update", handler.UpdateIngredient)
	ingredients.POST("/remove", handler.RemoveIngredients)

	return handler
}

func (i *ingredientsHandler) GetIngredients(c *gin.Context) {
	dbResult, dbErr := i.db.ExecSP("get_ingredients")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var ingredients domain.IngredientsResponse
	err := jsoniter.Unmarshal(dbResult, &ingredients)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	c.JSON(http.StatusOK, ingredients)
}

func (i *ingredientsHandler) GetIngredientsTypes(c *gin.Context) {
	dbResult, dbErr := i.db.ExecSP("get_ingredients_types")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var ingredientTypes []domain.IngredientTypes
	err := jsoniter.Unmarshal(dbResult, &ingredientTypes)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	c.JSON(http.StatusOK, ingredientTypes)
}

func (i *ingredientsHandler) GetIngredientsPages(c *gin.Context) {
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

	dbResult, dbErr := i.db.ExecSP("get_ingredients_pages", page, ingType)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var ingredients []domain.IngredientsPages
	err = jsoniter.Unmarshal(dbResult, &ingredients)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	for i := range ingredients {
		date := time.Now().Add(time.Hour * 24 * time.Duration(ingredients[i].ExpDt)).Format(time.DateOnly)
		ingredients[i].ExpDtString = date
		ingredients[i].ExpDt = 0
	}

	c.JSON(http.StatusOK, ingredients)
}

func (i *ingredientsHandler) GetFilteredIngredients(c *gin.Context) {
	var dt = c.Query("dt")

	expDt, err := strconv.Atoi(dt)
	if err != nil {
		c.JSON(http.StatusBadRequest, "dt must be an integer")
	}

	dbResult, dbErr := i.db.ExecSP("get_ingredients_filter", expDt)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var ingredients domain.IngredientsResponse
	err = jsoniter.Unmarshal(dbResult, &ingredients)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}
	if ingredients.Data == nil {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	c.JSON(http.StatusOK, ingredients)
}

func (h *ingredientsHandler) UpdateIngredient(c *gin.Context) {
	var req domain.UpdateIngredientRequest

	if err := c.BindJSON(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("update_ingredient", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *ingredientsHandler) RemoveIngredients(c *gin.Context) {
	ingID := c.Query("id")

	_, dbErr := h.db.ExecSP("remove_ingredients", ingID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
