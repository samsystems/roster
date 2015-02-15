Inventory API
===============

Provides api for SAM Inventory System.

It consists of 1 core component:

- Beego - A web framework for Golang - https://github.com/astaxie/beego/

# Dependencies

Inventory API requires `Go`, `Beego` and few other tools installed.

## Installation

If you don't have `Go` installed, follow installation instructions described here: http://golang.org/doc/install

Now go to your GOPATH location and run:

```
go get github.com/rolian85/inventory
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
