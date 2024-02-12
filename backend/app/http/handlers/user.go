package handlers

import (
	"crypto/rand"
	"encoding/json"
	"image"
	"image/jpeg"
	"image/png"
	"math/big"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type userHandler struct {
	db         repository.Driver
	jwtService *domain.JWTService
}

func NewUserHandler(db repository.Driver, router *gin.Engine, jwtService *domain.JWTService) *userHandler {
	handler := &userHandler{
		db:         db,
		jwtService: jwtService,
	}

	user := router.Group("/user")

	user.POST(`/login`, handler.Login)
	user.POST(`/registration`, handler.Registration)
	user.GET(`/get`, handler.GetUsers)

	return handler
}

func (h *userHandler) Registration(c *gin.Context) {
	var userData domain.RegistrationRequest

	if err := c.ShouldBind(&userData); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}
	if userData.Image.Filename == "" {
		userData.Image.Filename = "mock-image.jpg"
		userData.ImagePath = userData.Image.Filename
	} else {
		r, _ := rand.Int(rand.Reader, big.NewInt(10000000))
		userData.Image.Filename = strconv.Itoa(int(r.Int64())) + userData.Image.Filename
		userData.ImagePath = userData.Image.Filename
		saveImageFile(c, userData.Image)
	}

	dbResult, dbErr := h.db.ExecSP("create_user", userData)
	if dbErr != nil {
		if userData.ImagePath != "mock-image.jpg" {
			err := os.Remove("static/" + userData.ImagePath)
			if err != nil {
				logger.Error(err)
			}
		}
		setDBError(c, dbErr)
		return
	}

	var uid domain.UserID
	err := jsoniter.Unmarshal(dbResult, &uid)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, nil)
		return
	}

	token, err := h.jwtService.GenerateTokenFromUserData(uid.ID)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, nil)
		return
	}

	var response domain.LoginResponse
	err = jsoniter.Unmarshal(dbResult, &response)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, nil)
		return
	}

	response.Token = token

	c.JSON(http.StatusOK, response)
}

func (h *userHandler) Login(c *gin.Context) {
	var userData domain.LoginRequest

	if err := c.BindJSON(&userData); err != nil {
		logger.Log(err.Error())
		c.JSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	dbResult, dbErr := h.db.ExecSP("validate_credentials", userData)
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}
	var response domain.LoginResponse
	err := json.Unmarshal(dbResult, &response)
	if err != nil {
		logger.Errorf("cannot unmarshal userToken: %v", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, errdomain.InternalServerError)
	}

	token, err := h.GetTokenFromDBResp(dbResult)
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, errdomain.InternalServerError)
		return
	}
	response.Token = token

	c.JSON(http.StatusOK, response)
}

func (s *userHandler) GetUsers(c *gin.Context) {
	dbResult, dbErr := s.db.ExecSP("get_users")
	if dbErr != nil {
		setDBError(c, dbErr)
		return
	}

	if len(dbResult) == 0 {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	var users domain.Users
	err := jsoniter.Unmarshal(dbResult, &users)
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *userHandler) GetTokenFromDBResp(dbResult []byte) (string, error) {
	var user domain.UserID
	err := json.Unmarshal(dbResult, &user)
	if err != nil {
		logger.Errorf("cannot unmarshal userToken: %v", err)
	}

	token, err := h.jwtService.GenerateTokenFromUserData(user.ID)
	if err != nil {
		logger.Errorf("cannot generate token: %v", err)
		return "", err
	}

	return token, nil
}

func saveImageFile(c *gin.Context, reqFile multipart.FileHeader) {
	file, err := os.Create("./static/" + reqFile.Filename)
	defer func() {
		err := file.Close()
		if err != nil {
			logger.Error(err)
		}
	}()

	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, nil)
		return
	}

	fileNameParts := strings.Split(reqFile.Filename, ".")
	ext := fileNameParts[len(fileNameParts)-1]

	mFile, err := reqFile.Open()
	defer func() {
		err := mFile.Close()
		if err != nil {
			logger.Error(err)
		}
	}()
	if err != nil {
		logger.Error(err)
		c.AbortWithStatusJSON(http.StatusBadRequest, errdomain.InvalidJsonError)
		return
	}

	var img image.Image
	switch ext {
	case "jpg", "jpeg":
		img, err = jpeg.Decode(mFile)
		if err != nil {
			logger.Error(err)
			c.AbortWithStatusJSON(http.StatusBadRequest, errdomain.InvalidJsonError)
			return
		}

		err = jpeg.Encode(file, img, &jpeg.Options{
			Quality: 100,
		})
		if err != nil {
			logger.Error(err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, nil)
			return
		}
	case "png":
		img, err = png.Decode(mFile)
		if err != nil {
			logger.Error(err)
			c.AbortWithStatusJSON(http.StatusBadRequest, errdomain.InvalidJsonError)
			return
		}

		err = png.Encode(file, img)
		if err != nil {
			logger.Error(err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, nil)
			return
		}
	default:
		c.AbortWithStatusJSON(http.StatusBadRequest, "file extension must be jpg, jpeg or png")
		return
	}
}
