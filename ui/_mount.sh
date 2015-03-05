#!/bin/bash
# -------------------------------------------------------------------------
if [ ! -d bower_components ]; then
mkdir -p /var/tmp/inventory/bower_components
ln -s /var/tmp/inventory/bower_components
fi
if [ ! -d node_modules ]; then
mkdir -p /var/tmp/inventory/node_modules
ln -s /var/tmp/inventory/node_modules
fi

chmod -R 777 node_modules;
chmod -R 777 bower_components;
