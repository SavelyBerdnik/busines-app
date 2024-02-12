package main

import (
	"flag"

	"gitlab.com/business-app-211-322/lab-3/backend/app/config"
	"gitlab.com/business-app-211-322/lab-3/backend/app/http"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository/postgres"
	"gitlab.com/f4lc09/logger"
)

func main() {
	logger.InitLogger()
	configPath := flag.String("c", "./config.yaml", "a path for config file")
	flag.Parse()

	config.Read(*configPath)
	cfg := config.Get()

	db := postgres.Connect(cfg)
	defer db.Close()

	gostDocServer := http.NewGostDocServer(cfg, db)
	gostDocServer.Serve()
}
