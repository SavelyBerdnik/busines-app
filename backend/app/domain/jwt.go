package domain

import (
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"gitlab.com/business-app-211-322/lab-3/backend/app/config"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"
	"gitlab.com/f4lc09/logger"
)

type JWTService struct {
	cfg *config.Config
}

func NewJWTService(cfg *config.Config) *JWTService {
	return &JWTService{
		cfg: cfg,
	}
}

func (s *JWTService) GenerateTokenFromUserData(id int64) (string, error) {
	tokenTTL := time.Hour * time.Duration(s.cfg.Auth.TokenTTL)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &AuthToken{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenTTL)),
		},
		UserID: id,
	})

	tokenString, err := token.SignedString([]byte(s.cfg.Auth.SigningKey))

	if err != nil {
		return "", errdomain.FailedToSignTokenError
	}

	return tokenString, nil
}

func (s *JWTService) ExtractBearerToken(header string) (string, error) {
	if header == "" {
		logger.Log("токен пустой")
		return "", errdomain.InvalidHeaderError
	}

	jwtToken := strings.Split(header, " ")
	if len(jwtToken) != 2 {
		logger.Log("неверная структура токена")
		return "", errdomain.InvalidHeaderError
	}

	return jwtToken[1], nil
}

func (s *JWTService) ParseToken(jwtToken string) (*AuthToken, error) {
	token, err := jwt.ParseWithClaims(jwtToken, &AuthToken{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			logger.Log("неверная сигнатура токена")
			return nil, errdomain.InvalidTokenError
		}
		return []byte(s.cfg.Auth.SigningKey), nil
	})

	if err != nil {
		logger.Log("токен не соответствует структуре")
		return nil, errdomain.InvalidTokenError
	}

	claims, ok := token.Claims.(*AuthToken)
	if !ok || !token.Valid {
		logger.Log("токен не соответствует структуре")
		return nil, errdomain.InvalidTokenError
	}

	return claims, nil
}

func (s *JWTService) GetRefreshTokenTTL() int {
	refreshTTL := 24 * 60 * 60 * s.cfg.Auth.RefreshTTL
	return refreshTTL
}
