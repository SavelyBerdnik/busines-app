package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type mapHandler struct {
	db repository.Driver
}

func NewMapHandler(db repository.Driver, router *gin.Engine, jwtService *domain.JWTService) *mapHandler {
	handler := &mapHandler{
		db: db,
	}

	maps := router.Group("/map")

	maps.GET("/get", AuthMiddleware(jwtService), handler.GetMap)
	maps.POST("/create", AuthMiddleware(jwtService), handler.CreateMapIcon)
	maps.POST("/edit", AuthMiddleware(jwtService), handler.EditMapIcon)
	maps.POST("/remove", AuthMiddleware(jwtService), handler.RemoveMapIcon)

	return handler
}

func (i *mapHandler) GetMap(c *gin.Context) {
	mapName := c.Query("map_name")

	dbResult, dbErr := i.db.ExecSP("get_map_icons", mapName)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusOK, []int{})
		return
	}

	var maps domain.Maps
	err := jsoniter.Unmarshal(dbResult, &maps)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	response := make(domain.GetMapsResponse, len(maps))
	for i := range maps {
		response[maps[i].ImageName] = maps[i]
	}

	c.JSON(http.StatusOK, response)
}

func (i *mapHandler) CreateMapIcon(c *gin.Context) {
	var req domain.CreateMapIconRequest

	if err := c.BindJSON(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := i.db.ExecSP("create_map_icon", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (i *mapHandler) EditMapIcon(c *gin.Context) {
	var req domain.CreateMapIconRequest

	if err := c.BindJSON(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	_, dbErr := i.db.ExecSP("update_map_icon", req)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (i *mapHandler) RemoveMapIcon(c *gin.Context) {
	id := c.Query("id")

	_, dbErr := i.db.ExecSP("remove_map_icon", id)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
