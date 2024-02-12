package domain

type UserID struct {
	ID int64 `json:"id"`
}

type User struct {
	ID        int64  `json:"id"`
	Login     string `json:"login"`
	Role      string `role:"role"`
	FullName  string `json:"full_name"`
	ImagePath string `json:"image_path"`
}

type Users []User
