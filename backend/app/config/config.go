package config

import (
	"log"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	DatabaseConfig struct {
		DSN string `yaml:"dsn"`
	} `yaml:"repository"`
	HttpServer struct {
		Port string `yaml:"port"`
	} `yaml:"httpServer"`
	Auth *struct {
		SigningKey string `yaml:"signingKey"`
		TokenTTL   int32  `yaml:"tokenTTL"`
		RefreshTTL int    `yaml:"refreshTTL"`
	}
}

var cfg Config

func Read(configPath string) {
	err := cleanenv.ReadConfig(configPath, &cfg)
	if err != nil {
		log.Fatalf("Failed to read config: %v", err)
	}

	if cfg.Auth == nil {
		log.Fatal("No Auth key in config")
	}
}

func Get() *Config {
	return &cfg
}
