#!/bin/bash

# 前端
if [ -f "dist/index.html" ]; then
  echo 'copying cimp-web to build path...'
  mkdir -p deploy/cimp-web/build/dist/
  cp -r dist/* deploy/cimp-web/build/dist/
fi
