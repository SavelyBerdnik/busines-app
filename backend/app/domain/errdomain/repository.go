package errdomain

type DBError struct {
	Message  string
	Internal bool
}
