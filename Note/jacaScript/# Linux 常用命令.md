# Linux 常用命令

## firewall（防火墙）

```bash
# 查看所有已经开启的端口
firewall-cmd --list-port

# 查看防火墙所有信息
firewall-cmd --list-all

# 创建新的端口
# 说明:
# –zone #作用域
# –add-port=80/tcp #添加端口，格式为：端口/通讯协议
# –permanent 永久生效，没有此参数重启后失效
firewall-cmd --zone=public --add-port=80/tcp --permanent
 
# 创建多个端口:
firewall-cmd --zone=public --add-port=80-90/tcp --permanent

#删除已创建的端口
firewall-cmd --zone=public --remove-port=80/tcp --permanent
```