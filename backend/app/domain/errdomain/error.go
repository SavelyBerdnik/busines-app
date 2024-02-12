package errdomain

type ErrorResponse struct {
	Message string `json:"message"`
}

func (e *ErrorResponse) Error() string {
	return e.Message
}

var (
	InvalidJsonError = &ErrorResponse{
		Message: "некорректный запрос",
	}
	MaxFileSizeExceeded = &ErrorResponse{
		Message: "слишком большой файл",
	}
	UnauthorizedError = &ErrorResponse{
		Message: "отказ в доступе",
	}
	InternalServerError = &ErrorResponse{
		Message: "возникла какая-то ошибка",
	}
	InvalidFile = &ErrorResponse{
		Message: "ошибка отправки файла",
	}
)

type UnsignedResponse struct {
	Message interface{} `json:"message"`
}
