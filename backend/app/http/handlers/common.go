package handlers

import (
	"github.com/gin-gonic/gin"
)

type commonHandler struct {
}

func NewCommonHandler(router *gin.Engine) *commonHandler {
	handler := &commonHandler{}

	router.Static("/static", "./static")

	return handler
}
