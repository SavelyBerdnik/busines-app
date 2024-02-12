package errdomain

var (
	InvalidTokenError = &ErrorResponse{
		Message: "неверный токен авторизации",
	}
	InvalidHeaderError = &ErrorResponse{
		Message: "некорректный заголовок авторизации",
	}
)
