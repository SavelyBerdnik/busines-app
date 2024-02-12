package http

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"gitlab.com/business-app-211-322/lab-3/backend/app/config"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/http/handlers"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type gostDocServer struct {
	cfg    *config.Config
	db     repository.Driver
	router *gin.Engine
}

func NewGostDocServer(cfg *config.Config, db repository.Driver) *gostDocServer {
	return &gostDocServer{
		cfg: cfg,
		db:  db,
	}
}

func (s *gostDocServer) Serve() {
	port := s.cfg.HttpServer.Port
	if port == "" {
		port = "8080"
	}

	s.router = gin.New()
	s.router.Use(
		gin.Recovery(),
		handlers.LogRequest(),
	)

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"*", "Authorization", "Content-Type"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}

	s.router.Use(cors.New(config))
	jwtService := domain.NewJWTService(s.cfg)
	handlers.NewUserHandler(s.db, s.router, jwtService)
	handlers.NewEquipmentHandler(s.db, s.router, jwtService)
	handlers.NewOrdersHandler(s.db, s.router, jwtService)
	handlers.NewMapHandler(s.db, s.router, jwtService)
	handlers.NewSpecificationsHandler(s.db, s.router, jwtService)
	handlers.NewSupplierHandler(s.db, s.router)
	handlers.NewIngredientsHandler(s.db, s.router)
	handlers.NewCakeDecorationsHandler(s.db, s.router)
	handlers.NewGoodsHandler(s.db, s.router)
	handlers.NewCommonHandler(s.router)
	handlers.NewGandonHandler(s.router, jwtService, s.db)

	logger.Logf("Server started on port %s", s.cfg.HttpServer.Port)
	err := http.ListenAndServe(":"+port, s.router)
	if err != nil {
		logger.Error(err)
	}
}
