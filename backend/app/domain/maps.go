package domain

type Map struct {
	ID        *int    `json:"id,omitempty"`
	X         float32 `json:"x"`
	Y         float32 `json:"y"`
	ImageName string  `json:"image_name"`
	MapName   string  `json:"map_name"`
}

type Maps []Map

type GetMapsResponse map[string]Map

type CreateMapIconRequest Map
