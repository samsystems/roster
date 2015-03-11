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
	//	PublicRoute []string
}

func (configuration *Configuration) Load(filename string) (err error) {
	data, err := ioutil.ReadFile(filename)

	if err != nil {
		panic(filename + " was not found")
	}

	err = configuration.Parse(data)

	return err
}

func (configuration *Configuration) Parse(data []byte) (err error) {
	err = json.Unmarshal(data, &configuration)

	return
}
