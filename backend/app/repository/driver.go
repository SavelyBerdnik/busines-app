package repository

import "gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"

type Driver interface {
	ExecSP(string, ...any) ([]byte, *errdomain.DBError)
	Close() error
}
