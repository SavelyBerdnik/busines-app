package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type equipmentHandler struct {
	db         repository.Driver
	jwtService *domain.JWTService
}

func NewEquipmentHandler(db repository.Driver, router *gin.Engine, jwtService *domain.JWTService) *equipmentHandler {
	handler := &equipmentHandler{
		db:         db,
		jwtService: jwtService,
	}

	eqp := router.Group("/equipment")

	eqp.POST(`/create`, handler.CreateEquipment)
	eqp.POST(`/create-failure`, handler.CreateEquipmentFailure)
	eqp.GET(`/get`, handler.GetEquipment)
	eqp.GET(`/get-failure`, handler.GetEquipmentFailure)
	eqp.GET(`/get-failure-diag`, handler.GetEquipmentFailureDiag)
	eqp.GET(`/types`, handler.GetEquipmentTypes)
	eqp.POST(`/edit`, handler.UpdateEquipment)
	eqp.POST(`/remove`, handler.RemoveEquipment)

	return handler
}

func (h *equipmentHandler) CreateEquipment(c *gin.Context) {
	var req domain.CreateEquipmentRequest

	if err := c.BindJSON(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("create_eqp", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *equipmentHandler) GetEquipment(c *gin.Context) {
	const layout = "2006-01-02"

	rd, dbErr := h.db.ExecSP("get_eqp")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}
	if len(rd) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var dbInfo []domain.GetEquipmentResponse
	if err := jsoniter.Unmarshal(rd, &dbInfo); err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	for i := range dbInfo {
		dbInfo[i].EqpBuyDate = strings.Split(dbInfo[i].EqpBuyDate, "T")[0]
		t, err := time.Parse(layout, dbInfo[i].EqpBuyDate)
		if err != nil {
			logger.Error(err)
			c.JSON(http.StatusInternalServerError, errdomain.InternalServerError)
			return
		}
		days := int64(time.Since(t).Hours() / 24)

		dbInfo[i].Age = days
	}

	c.JSON(http.StatusOK, dbInfo)
}

func (h *equipmentHandler) UpdateEquipment(c *gin.Context) {
	var req domain.UpdateEquipmentRequest

	if err := c.BindJSON(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("update_eqp", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *equipmentHandler) RemoveEquipment(c *gin.Context) {
	var queryID = c.Query("eqp_id")

	id, err := strconv.Atoi(queryID)
	if err != nil {
		c.JSON(http.StatusBadRequest, "eqp id must be an integer")
	}

	_, dbErr := h.db.ExecSP("remove_eqp", id)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *equipmentHandler) GetEquipmentTypes(c *gin.Context) {
	dbResult, dbErr := h.db.ExecSP("get_eqp_types")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var eqps domain.GetEquipmentTypesResponse
	err := jsoniter.Unmarshal(dbResult, &eqps)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, eqps)
}

func (h *equipmentHandler) CreateEquipmentFailure(c *gin.Context) {
	var req domain.CreateEquipmentFailure

	if err := c.BindJSON(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("create_equipment_failure", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *equipmentHandler) GetEquipmentFailure(c *gin.Context) {
	dbResult, dbErr := h.db.ExecSP("get_eqp_failure")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var fails []domain.CreateEquipmentFailure
	err := jsoniter.Unmarshal(dbResult, &fails)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, fails)
}

func (h *equipmentHandler) GetEquipmentFailureDiag(c *gin.Context) {
	dbResult, dbErr := h.db.ExecSP("get_eqp_failure_diag")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var fails []domain.EquipmentFailureDiag
	err := jsoniter.Unmarshal(dbResult, &fails)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, fails)
}
