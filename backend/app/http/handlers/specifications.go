package handlers

import (
	"net/http"
	"strconv"

	jsoniter "github.com/json-iterator/go"

	"github.com/gin-gonic/gin"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type specificationsHandler struct {
	db repository.Driver
}

func NewSpecificationsHandler(db repository.Driver, router *gin.Engine, jwtService *domain.JWTService) *specificationsHandler {
	var handler = &specificationsHandler{
		db: db,
	}

	specifications := router.Group("/specifications")

	specifications.POST("/decorations/create", AuthMiddleware(jwtService), handler.CreateDecorationSpecifications)
	specifications.GET("/decorations/get", AuthMiddleware(jwtService), handler.GetDecorationsSpecification)

	specifications.POST("/ingredients/create", AuthMiddleware(jwtService), handler.CreateIngredientsSpecifications)
	specifications.GET("/ingredients/get", AuthMiddleware(jwtService), handler.GetIngredientsSpecification)

	specifications.POST("/semifinished/create", AuthMiddleware(jwtService), handler.CreateSemifinishedSpecifications)
	specifications.GET("/semifinished/get", AuthMiddleware(jwtService), handler.GetSemifsSpecification)

	specifications.POST("/operation/create", AuthMiddleware(jwtService), handler.CreateOperationSpecification)
	specifications.GET("/operation/get", AuthMiddleware(jwtService), handler.GetOperationsSpecification)
	specifications.POST("/operation/validate", AuthMiddleware(jwtService), handler.ValidateOperationSpecification)

	specifications.POST("/finish/create", AuthMiddleware(jwtService), handler.CreateFinishSpecifications)
	specifications.GET("/final/get", AuthMiddleware(jwtService), handler.GetFinalSpecification)
	specifications.GET("/goods/get", AuthMiddleware(jwtService), handler.GetSpecificationGoods)

	return handler
}

func (h *specificationsHandler) CreateDecorationSpecifications(c *gin.Context) {
	var req []domain.CreateDecorationSpecification

	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("create_specification_cakedecorations", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *specificationsHandler) CreateIngredientsSpecifications(c *gin.Context) {
	var req []domain.CreateIngredientSpecification1

	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("create_specification_ingredients", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *specificationsHandler) CreateSemifinishedSpecifications(c *gin.Context) {
	var req []domain.CreateSemifinishedSpecification

	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("create_specification_semifinished", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *specificationsHandler) CreateFinishSpecifications(c *gin.Context) {
	var req domain.FinishSpecification

	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("create_specification_finish", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *specificationsHandler) ValidateOperationSpecification(c *gin.Context) {
	var (
		req  []domain.OperationSpecification
		eqps []domain.GetEquipmentResponse
	)

	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	eqpTypeIDCount := make(map[int64]int64)

	rd, dbErr := h.db.ExecSP("get_eqp")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}
	if len(rd) == 0 {
		c.JSON(http.StatusBadRequest, "нет инструментов, нужно сначала закупить")
		return
	}

	if err := jsoniter.Unmarshal(rd, &eqps); err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	for i := range eqps {
		if _, ok := eqpTypeIDCount[eqps[i].EqpTypeID]; !ok {
			eqpTypeIDCount[eqps[i].EqpTypeID] = 0
		}
		eqpTypeIDCount[eqps[i].EqpTypeID] += eqps[i].EqpQty
	}

	// Проверяем достаток оборудования
	// eqp_type_id, operation_seq, semif
	eqpOperSemifCount := make(map[int64]map[int]map[string]int64)
	for i := range req {
		if _, ok := eqpOperSemifCount[req[i].EqpTypeID]; !ok {
			eqpOperSemifCount[req[i].EqpTypeID] = map[int]map[string]int64{
				req[i].OperationSeq: {
					req[i].Semif: 1,
				},
			}
			continue
		}

		if _, ok := eqpOperSemifCount[req[i].EqpTypeID][req[i].OperationSeq]; !ok {
			eqpOperSemifCount[req[i].EqpTypeID][req[i].OperationSeq] = map[string]int64{
				req[i].Semif: 1,
			}
			continue
		}

		if _, ok := eqpOperSemifCount[req[i].EqpTypeID][req[i].OperationSeq][req[i].Semif]; !ok {
			eqpOperSemifCount[req[i].EqpTypeID][req[i].OperationSeq][req[i].Semif] = 1
			continue
		}

		eqpOperSemifCount[req[i].EqpTypeID][req[i].OperationSeq][req[i].Semif] += 1
	}

	for eqp_type_id, operSemifCount := range eqpOperSemifCount {
		for _, semifCount := range operSemifCount {
			eqpNeed := int64(0)

			for semif, count := range semifCount {
				// Проверяем, что в момент проведения операции над изделием
				// нет операций над полуфабрикатами
				if semif == "" && len(semifCount) > 1 {
					c.JSON(http.StatusBadRequest, "нельзя одновременно проводить операцию над изделием и полуфабрикатом")
					return
				}
				eqpNeed += count
			}
			if eqpNeed > eqpTypeIDCount[eqp_type_id] {
				c.JSON(http.StatusBadRequest, "не хватает оборудования")
				return
			}
		}
	}

	// Проверяем параллельность
	operSemifCount := map[int]map[string]int{}
	for i := range req {
		if _, ok := operSemifCount[req[i].OperationSeq]; !ok {
			operSemifCount[req[i].OperationSeq] = map[string]int{
				req[i].Semif: 1,
			}
			continue
		}

		if _, ok := operSemifCount[req[i].OperationSeq][req[i].Semif]; !ok {
			operSemifCount[req[i].OperationSeq][req[i].Semif] = 1
			continue
		}

		operSemifCount[req[i].OperationSeq][req[i].Semif] += 1
	}

	for _, semifCount := range operSemifCount {
		for _, count := range semifCount {
			if count > 1 {
				c.JSON(http.StatusBadRequest, "невозможно параллельно проводить несколько операций над изделием или одним и тем же полуфабрикатом")
				return
			}
		}
	}

	// Проверяем, что есть одно для изделия
	var hasGoods bool
	for i := range req {
		if req[i].Semif == "" {
			hasGoods = true
		}
	}
	if !hasGoods {
		c.JSON(http.StatusBadRequest, "нет операции для изделия")
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *specificationsHandler) CreateOperationSpecification(c *gin.Context) {
	var req []domain.OperationSpecification

	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := h.db.ExecSP("create_specification_operation", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *specificationsHandler) GetSpecificationGoods(c *gin.Context) {
	var goodIDString = c.Query("good_id")

	goodID, err := strconv.Atoi(goodIDString)
	if err != nil {
		c.JSON(http.StatusBadRequest, "goodID must be an integer")
		return
	}

	dbResult, dbErr := h.db.ExecSP("get_specification_goods", goodID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}
	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var sgData struct {
		SpecificationGoods domain.GetSpecificationGoodsResponse `json:"data"`
		Semifs             []domain.SemifsSpecification         `json:"semifs"`
	}
	err = jsoniter.Unmarshal(dbResult, &sgData)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	uniqIngIDs := map[int64]bool{}
	uniqOperIDs := map[int64]bool{}
	IngsInSemifs := []domain.IngredientSpecificationForSemifs{}
	OpersInSemifs := []domain.Opers{}
	for i, d := range sgData.Semifs {
		for _, d2 := range d.Ings {
			if !uniqIngIDs[d2.IngredientID] {
				IngsInSemifs = append(IngsInSemifs, d2)
				uniqIngIDs[d2.IngredientID] = true
			}

		}
		for _, d2 := range d.Opers {
			if !uniqOperIDs[d2.OperationID] {
				OpersInSemifs = append(OpersInSemifs, d2)
				uniqOperIDs[d2.OperationID] = true
			}
		}
		sgData.Semifs[i].Ings = IngsInSemifs
		sgData.Semifs[i].Opers = OpersInSemifs

		uniqIngIDs = map[int64]bool{}
		uniqOperIDs = map[int64]bool{}
		IngsInSemifs = []domain.IngredientSpecificationForSemifs{}
		OpersInSemifs = []domain.Opers{}
	}

	c.JSON(http.StatusOK, sgData)
}

func (h *specificationsHandler) GetIngredientsSpecification(c *gin.Context) {
	goodID := c.Query("good_id")

	dbResult, dbErr := h.db.ExecSP("get_specification_ingredients", goodID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var resp []domain.IngredientSpecificationGet
	err := jsoniter.Unmarshal(dbResult, &resp)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, resp)
}
func (h *specificationsHandler) GetDecorationsSpecification(c *gin.Context) {
	goodID := c.Query("good_id")

	dbResult, dbErr := h.db.ExecSP("get_specification_cakedecorations", goodID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var resp []domain.DecorationSpecification
	err := jsoniter.Unmarshal(dbResult, &resp)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, resp)
}
func (h *specificationsHandler) GetSemifsSpecification(c *gin.Context) {
	goodID := c.Query("good_id")

	dbResult, dbErr := h.db.ExecSP("get_specification_semifinished", goodID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var resp []domain.SemifsSpecification
	err := jsoniter.Unmarshal(dbResult, &resp)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, resp)
}
func (h *specificationsHandler) GetOperationsSpecification(c *gin.Context) {
	goodID := c.Query("good_id")

	dbResult, dbErr := h.db.ExecSP("get_specification_operation", goodID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var resp []domain.OperationSpecification
	err := jsoniter.Unmarshal(dbResult, &resp)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, resp)
}
func (h *specificationsHandler) GetFinalSpecification(c *gin.Context) {
	goodID := c.Query("good_id")

	dbResult, dbErr := h.db.ExecSP("get_specification_final", goodID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var resp domain.FinishSpecification
	err := jsoniter.Unmarshal(dbResult, &resp)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, resp)
}
