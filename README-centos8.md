# arduino-air-monitor-server

作为 arduino-air-monitor 数据与网站服务

## Nas Docker Linux 环境安装与配置

```bash
# 查看版本
cat /etc/redhat-release

# 备份
cd /etc/yum.repos.d/
mkdir repo_bak
mv *.repo repo_bak/

# 准备源文件
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-8.repo

# 更新
sed -i -e"s|mirrors.cloud.aliyuncs.com|mirrors.aliyun.com|g " /etc/yum.repos.d/CentOS-*
sed -i -e "s|releasever|releasever-stream|g" /etc/yum.repos.d/CentOS-*

# 清缓存
yum clean all && yum makecache

# 安装
yum install -y net-tools

# 安装nodejs
yum install -y git
curl -o- https://gitee.com/RubyMetric/nvm-cn/raw/main/install.sh | bash
chmod +x ~/.nvm/nvm.sh
source ~/.bashrc

# 查看可安装版本
nvm ls
# 安装版本
nvm install 22
# 列出所有可安装版本
nvm ls-remote
```

### 启动

```bash
# 脚本启动
sh /home/arduino-air-monitor-server/launch.sh

# 查看端口
netstat -tunlp
```

### 自启动（未成功）

```bash
cd /etc/init.d

cp /home/arduino-air-monitor-server/launch.sh /etc/init.d/launch.sh

chkconfig --add /etc/init.d/launch.sh
cd /etc/init.d/
chkconfig launch.sh on
```

修改

```bash
chmod +x /etc/rc.d/rc.local
vi /etc/rc.d/rc.local
```

添加命令

```bash
# /etc/rc.d/rc.local

sh /home/arduino-air-monitor-server/launch.start
```

配置rc.local服务

```bash
vi /usr/lib/systemd/system/rc-local.service
```

添加最后

```bash
# /usr/lib/systemd/system/rc-local.service

[Install]
WantedBy=multi-user.target
```