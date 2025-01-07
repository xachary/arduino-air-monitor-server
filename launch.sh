#!/bin/bash

# 同步时间
ntpd -d -q -n -p ntp3.aliyun.com

# 后台启动
nohup node /home/arduino-air-monitor-server/node-server/index.js > output.log 2>&1 &

exit 0