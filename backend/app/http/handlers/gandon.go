package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type gandonHandler struct {
	db repository.Driver
}

func NewGandonHandler(router *gin.Engine, jwtService *domain.JWTService, db repository.Driver) *gandonHandler {
	handler := &gandonHandler{
		db: db,
	}

	gandon := router.Group("gandon")
	gandon.GET("/get", AuthMiddleware(jwtService), handler.GetGandonDiagram)

	return handler
}

func (h *gandonHandler) GetGandonDiagram(c *gin.Context) {
	var goodIDString = c.Query("good_id")

	goodID, err := strconv.Atoi(goodIDString)
	if err != nil {
		c.JSON(http.StatusBadRequest, "goodID must be an integer")
		return
	}

	dbResult, dbErr := h.db.ExecSP("get_specification_operation", goodID)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}
	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var opers []domain.OperationSpecification
	err = jsoniter.Unmarshal(dbResult, &opers)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	dbResult, dbErr = h.db.ExecSP("get_eqp_types")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}
	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var eqp domain.GetEquipmentTypesResponse
	err = jsoniter.Unmarshal(dbResult, &eqp)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	eqpNameByTypeID := make(map[int64]string)
	for i := range eqp {
		eqpNameByTypeID[eqp[i].EqpTypeID] = eqp[i].EqpTypeName
	}

	eqpUsedTimes := make(map[int64]int)
	gandonResponse := make(domain.GandonResponse)
	currentSeq := 0
	for i := range opers {
		if currentSeq != opers[i].OperationSeq {
			currentSeq = opers[i].OperationSeq
			eqpUsedTimes = make(map[int64]int)

			gandonResponse = completeGandonToMaxTime(gandonResponse, currentSeq-1)
		}

		eqpUsedTimes[opers[i].EqpTypeID] += 1
		eqpName := eqpNameByTypeID[opers[i].EqpTypeID]
		eqpNameForGandon := eqpName + " " + strconv.Itoa(eqpUsedTimes[opers[i].EqpTypeID])

		if gandonResponse[eqpNameForGandon] == nil {
			gandonResponse[eqpNameForGandon] = make([]domain.GandonFields, 0)
			gandonResponse = completeGandonToMaxTime(gandonResponse, opers[i].OperationSeq-1)
		}

		name := opers[i].Semif
		if name == "" {
			name = "Изделие"
		}
		temp := domain.GandonFields{
			Seq:  opers[i].OperationSeq,
			Size: opers[i].OpTime,
			Text: opers[i].Operation + fmt.Sprintf(" (%s)", name),
		}
		gandonResponse[eqpNameForGandon] = append(gandonResponse[eqpNameForGandon], temp)
	}
	gandonResponse = completeGandonToMaxTime(gandonResponse, currentSeq+1)

	c.JSON(http.StatusOK, gandonResponse)
}

func completeGandonToMaxTime(g domain.GandonResponse, seqUntil int) domain.GandonResponse {
	max := 0

	for i := range g {
		sizeForRow := 0

		for j := range g[i] {
			if g[i][j].Seq <= seqUntil {
				sizeForRow += g[i][j].Size
			}
		}

		if sizeForRow > max {
			max = sizeForRow
		}
	}

	for i := range g {
		sizeForRow := 0

		for j := range g[i] {
			if g[i][j].Seq <= seqUntil {
				sizeForRow += g[i][j].Size
			}
		}

		if sizeForRow < max {
			seq := 0
			if len(g[i])-1 >= 0 {
				seq = len(g[i]) - 1
			}

			g[i] = append(g[i], domain.GandonFields{
				Text: "",
				Size: max - sizeForRow,
				Seq:  seq,
			})
		}
	}

	return g
}
