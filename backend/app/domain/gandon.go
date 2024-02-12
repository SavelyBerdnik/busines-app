package domain

type GandonFields struct {
	Text string `json:"text"`
	Size int    `json:"size"`
	Seq  int    `json:"seq"`
}

type GandonResponse map[string][]GandonFields
