package domain

import (
	"mime/multipart"

	"github.com/golang-jwt/jwt/v5"
)

type RegistrationRequest struct {
	Login     string               `form:"login" json:"login"`
	Password  string               `form:"password" json:"password"`
	FullName  string               `form:"full_name" json:"full_name"`
	Image     multipart.FileHeader `form:"file"`
	ImagePath string               `json:"image_path"`
}

type LoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type LoginResponse struct {
	ID        int    `json:"id"`
	Token     string `json:"token"`
	Role      string `json:"role"`
	FullName  string `json:"full_name"`
	ImagePath string `json:"image_path"`
}

type AuthToken struct {
	jwt.RegisteredClaims
	UserID int64 `json:"id"`
}
