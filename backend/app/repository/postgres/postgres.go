package postgres

import (
	"context"
	"errors"
	"fmt"
	"os"
	"sync"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"gitlab.com/business-app-211-322/lab-3/backend/app/config"
	"gitlab.com/business-app-211-322/lab-3/backend/app/domain/errdomain"
	"gitlab.com/business-app-211-322/lab-3/backend/app/repository"
	"gitlab.com/f4lc09/logger"
)

type postgresql struct {
	conn *pgx.Conn
}

var mutex sync.Mutex

func Connect(cfg *config.Config) repository.Driver {
	// urlExample := "postgres://username:password@localhost:5432/database_name"
	conn, err := pgx.Connect(context.Background(), cfg.DatabaseConfig.DSN)

	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	logger.Log("Connected to database")

	return &postgresql{conn}
}

func (p *postgresql) ExecSP(spName string, params ...any) ([]byte, *errdomain.DBError) {
	mutex.Lock()
	defer mutex.Unlock()
	var (
		dbError   *errdomain.DBError
		rawResult []byte
	)

	sql := fmt.Sprintf("select %s(", spName)
	for i := range params {
		if i == 0 {
			sql += "$1"
			continue
		}
		sql += fmt.Sprintf(", $%d", i+1)
	}
	sql += ");"

	row := p.conn.QueryRow(context.Background(), sql, params...)
	err := row.Scan(&rawResult)
	if err != nil {
		dbError = p.makeDBErr(err)

		return nil, dbError
	}

	return rawResult, dbError
}

func (p *postgresql) Close() error {
	return p.conn.Close(context.Background())
}

func (p *postgresql) makeDBErr(err error) *errdomain.DBError {
	var pgErr = new(pgconn.PgError)

	dbErr := &errdomain.DBError{}

	errors.As(err, &pgErr)
	if pgErr.Code != "P0001" {
		logger.Log(err.Error())
		dbErr.Internal = true
	}

	dbErr.Message = pgErr.Message
	return dbErr
}
