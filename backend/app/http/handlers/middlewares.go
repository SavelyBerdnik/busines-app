package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

func AuthMiddleware(jwtService *domain.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtToken, err := jwtService.ExtractBearerToken(c.GetHeader("Authorization"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, errdomain.UnsignedResponse{
				Message: err.Error(),
			})
			return
		}
		token, err := jwtService.ParseToken(jwtToken)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, errdomain.UnsignedResponse{
				Message: err.Error(),
			})
			return
		}
		c.Set("uid", token.UserID)

		c.Next()
	}
}

func BindRole(db repository.Driver) gin.HandlerFunc {
	return func(c *gin.Context) {
		uid := c.GetInt64("uid")

		dbResponse, dbErr := db.ExecSP("get_role_by_uid", uid)
		if dbErr != nil {
			setDBError(c, dbErr)
			c.Abort()
			return
		}
		role := string(dbResponse)
		if role == "" {
			logger.Errorf("empty role id, wtf?")
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		c.Set("role", role)

		c.Next()
	}
}

func LogRequest() func(*gin.Context) {
	return func(c *gin.Context) {
		url := c.Request.URL.Path
		method := c.Request.Method

		c.Next()

		status := c.Writer.Status()
		logger.Logf("%s request to %s -> %d", method, url, status)
	}
}

func setDBError(c *gin.Context, dbErr *errdomain.DBError) {
	if dbErr.Internal {
		c.JSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}

	c.JSON(http.StatusBadRequest, errdomain.ErrorResponse{
		Message: dbErr.Message,
	})
}
