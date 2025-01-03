# arduino-air-monitor-server

作为 arduino-air-monitor 数据与网站服务

## 文件夹映射

```bash
alpine_arduino - /home
alpine_cgroup - /sys/fs/cgroup
alpine_run - /run
```

## Nas Docker Linux 环境安装与配置

```bash
# 替换源
sed -i s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g /etc/apk/repositories

# 更新源
apk update

# nodejs
apk add nodejs
```

## 时区时间

```bash
# 查看时区
date -R

# 设置新的时区
apk add tzdata

# 查看可用的时区
ls /usr/share/zoneinfo

# 复制
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 设置时区
echo "Asia/Shanghai" >  /etc/timezone

# 同步
ntpd -d -q -n -p ntp3.aliyun.com
```

## 服务启动

把整个项目目录放在映射到容器中

```bash
# 如 /home 中
cd /home/arduino-air-monitor-server/node-server
# 启动
node index.js

# 又或者，后台启动
nohup node index.js > output.log 2>&1 &
# 查看进程
ps -a | grep "node index.js"
# 终结
kill "pid"
# 仅清空日志
cat /dev/null > output.log

# 查看端口
netstat -tunlp
```

```bash
# 启动脚本
sh /home/arduino-air-monitor-server/launch.sh

# 查看端口
netstat -tunlp
```

## 自启动（未成功）

```bash
# 安装
apk add openrc

# 复制文件
cp /home/arduino-air-monitor-server/launch /etc/init.d/launch
chmod +x /etc/init.d/launch

openrc default
rc-update add launch default

rc-service launch start
# rc-service launch restart

# 查询
rc-status

# 查看端口
netstat -tunlp

# 配置文件
vi /etc/rc.conf
```
