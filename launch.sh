#!/bin/bash

sleep 10s

# 后台启动
nohup node /home/arduino-air-monitor-server/node-server/index.js > output.log 2>&1 &

exit 0