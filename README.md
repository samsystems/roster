Roster [![wercker status](https://app.wercker.com/status/fe7fa70bc9471fdaff6bafc0eda3d74d/s "wercker status")](https://app.wercker.com/project/bykey/fe7fa70bc9471fdaff6bafc0eda3d74d)
===============

Provides api for SAM Inventory System.

It consists of 1 core component:

- Gorilla web toolkit - mux - http://www.gorillatoolkit.org/pkg/mux

# Dependencies

Inventory API requires `Go`, `Gorilla mux` and few other tools installed.

## Installation

If you don't have `Go` installed, follow installation instructions described here: http://golang.org/doc/install

Install dependencies
```
go get github.com/gorilla/mux
go get github.com/astaxie/beego/orm
go get github.com/go-sql-driver/mysql
go get code.google.com/p/go-uuid/uuid
go get github.com/golang/glog
go get golang.org/x/net/context
go get golang.org/x/oauth2
go get google.golang.org/cloud/compute/metadata
go get google.golang.org/api/storage/v1
```

Create a local config, and adjust to your environment

```
cp github.com/rolian85/inventory/config.json.default github.com/rolian85/inventory/config.json
```

And then:

```
go install github.com/rolian85/inventory
```
Finally, you can run:

```
./bin/inventory
```

And it means you can now direct your browser to `localhost:8085`

# Project structure

`/controllers`

All your controllers that serve defined routes.

`/helpers`

Helper functions.

`/models`

You database models.

`/routes`

Contains routes definitions.

`main.go`

This file starts your web application.
