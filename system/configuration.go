package system

import (
	"encoding/json"
	"io/ioutil"
)

type ConfigurationDatabase struct {
	Host     string `json:"host"`
	Name     string `json:"name"`
	User     string `json:"user"`
	Password string `json:"password"`
	Debug    bool   `json:"debug"`
}

type Configuration struct {
	Database ConfigurationDatabase
}

func (configuration *Configuration) Load(filename string) (err error) {
	data, err := ioutil.ReadFile(filename)

	if err != nil {
		return
	}

	err = configuration.Parse(data)

	return
}

func (configuration *Configuration) Parse(data []byte) (err error) {
	err = json.Unmarshal(data, &configuration)

	return
}
