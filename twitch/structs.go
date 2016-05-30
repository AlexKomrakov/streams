package twitch

type Images struct {
	Small    string `json:"small,omitempty"`
	Medium   string `json:"medium,omitempty"`
	Large    string `json:"large,omitempty"`
	Template string `json:"template,omitempty"`
}

type Links struct {
	Next          string `json:"next,omitempty"`
	Prev          string `json:"prev,omitempty"`
	Self          string `json:"self,omitempty"`
	Featured      string `json:"featured,omitempty"`
	Features      string `json:"features,omitempty"`
	Followed      string `json:"followed,omitempty"`
	Follows       string `json:"follows,omitempty"`
	Commercial    string `json:"commercial,omitempty"`
	Subscriptions string `json:"subscriptions,omitempty"`
	Editors       string `json:"editors,omitempty"`
	Teams         string `json:"teams,omitempty"`
	Videos        string `json:"videos,omitempty"`
	StreamKey     string `json:"stream_key,omitempty"`
	Chat          string `json:"chat,omitempty"`
	Summary       string `json:"summary,omitempty"`
	Channel       string `json:"channel,omitempty"`
}

type Game struct {
	Id          int    `json:"_id"`
	Links       Links  `json:"_links"`
	Box         Images `json:"box"`
	GiantbombId int    `json:"giantbomb_id"`
	Logo        Images `json:"logo"`
	Name        string `json:"name"`
}

type Top struct {
	Channels int  `json:"channels"`
	Game     Game `json:"game"`
	Viewers  int  `json:"viewers"`
}

type TopResponse struct {
	Links Links `json:"_links"`
	Total int   `json:"_total"`
	Top   []Top `json:"top"`
}