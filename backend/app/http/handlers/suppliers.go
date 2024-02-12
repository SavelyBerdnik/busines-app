package handlers

import (
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type supplierHandler struct {
	db repository.Driver
}

func NewSupplierHandler(db repository.Driver, router *gin.Engine) *supplierHandler {
	handler := &supplierHandler{
		db: db,
	}
	sups := router.Group("/suppliers")

	sups.GET("/get", handler.GetSuppliers)
	sups.GET("/eqp-report", handler.GetEquipmentReport)

	return handler
}

func (s *supplierHandler) GetSuppliers(c *gin.Context) {
	dbResult, dbErr := s.db.ExecSP("get_suppliers")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var suppliers domain.SupplierResponse
	err := jsoniter.Unmarshal(dbResult, &suppliers)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	c.JSON(http.StatusOK, suppliers)
}

func (s *supplierHandler) GetEquipmentReport(c *gin.Context) {
	dbResult, dbErr := s.db.ExecSP("get_eqp_report")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var equipmentReport []domain.EqpReport
	err := jsoniter.Unmarshal(dbResult, &equipmentReport)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	eqpReportMap := make(domain.EqpReportResp)
	for _, report := range equipmentReport {
		eqpID := report.EqpID
		if _, exists := eqpReportMap[eqpID]; !exists {
			eqpReportMap[eqpID] = []domain.EqpReport{}
		}

		eqpReportMap[eqpID] = append(eqpReportMap[eqpID], report)
	}

	sort.Sort(eqpReportMap)
	resp := make([][]domain.EqpReport, 0)

	ix := 0
	for i := range eqpReportMap {
		resp = append(resp, []domain.EqpReport{})
		resp[ix] = append(resp[ix], eqpReportMap[i]...)
		ix++
	}

	c.JSON(http.StatusOK, resp)
}
