#!/bin/bash

yarn install

if [ -z "`ps aux | grep "next build" | grep -v grep`" ]; then
  yarn build
  ps aux | grep node | grep -v grep | awk '{ print "kill -9", $2 }' | sh
  forever start -c 'yarn start' ./
fi

exit 0
