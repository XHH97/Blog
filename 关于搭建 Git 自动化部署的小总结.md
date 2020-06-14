# 关于搭建 Git 自动化部署的小总结

> 本人能力有限，不会做过多深入的理解，这只是一篇在搭建过程实践的笔记
> 主要使用通过使用 [Git Hook](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-%E9%85%8D%E7%BD%AE-Git) 的功能来进行配置，因为每一次进行  git 操作（push pull）的时候都能够触发这些 Hook 功能

这次的目的主要是实现本地输入 `git push` 时自动将更新的内容上传到服务器上，实现自动部署的功能。通过简单的了解发现，实现这样的功能有两种方式：第一种是通过将服务器作为一个 git 服务器来进行使用；第二种是使用如 github 这种第三方的 git 服务提供网站。

这里我们要介绍的是将服务器作为一个 git 服务器的方式。

首先我们简单的说一下我们需要准备的东西有哪一些：
**服务端**
- 放置 git 的文件夹（也就是放置 git hook 的文件夹）   /home/gitServer
- 放置项目的文件夹    /home/user/product
- /root/.ssh 文件夹下创建一个 `authorized_keys` 文件（用于存放来自需要与服务器通信的客户端公钥）    /root/.ssh

**客户端**
- 创建 `ssh` 的公钥和私钥
- 在 .ssh 文件中穿件 `config` 文件

## 客户端 && 服务端基本配置

> 首先已经确认你已经使用远程连接登录到服务器中了，所以后面不会过多的说登录到服务中的。

- 在客户端中使用 `ssh-keygen` 命令来创建 ssh 密钥，创建完成之后会在 `C:\Users\UserName` 文件夹中创建一个 `.ssh` 文件夹，这个文件夹使用存放刚才创建的密钥。
  - `id_rsa`    这个文件是私钥
  - `id_rsa.pub`    这个文件是公钥，用来放置在服务器中的

```bash
ssh-keygen -t rsa -C "你的邮箱地址或是其他的"
```

- 在 `.ssh` 文件中创建 `config` 文件，将一下内容放置在文件中，下面的内容也可以创建多个

```bash
Host rot   # 别名，使用 ssh 时，可以直接使用这个别名，而不需要再输入以下的内容了
  HostName 192.168.62.128   # 服务器 IP 地址
  Port 22   # 访问的端口号
  User root   # 使用服务器中哪一个用户
  PreferredAuthentications publickey    # 使用的认证方式
  IdentityFile C:\Users\UserName\.ssh\id_rsa   # 客户端放置秘钥的地址
```

- 在服务器上执行以下命令，创建 `authorized_keys` 文件，用来存放客户端生成的公钥，这样做主要实现无需要密码，就能够登录到服务器上

```bash
touch /root/.ssh/authorized_keys
// 或是
vim /root/.ssh/authorized_keys
```

- 将客户端创建的 `ssh` 密钥中的公钥内容（`id_rsa.pub` 文件）复制到在服务器中创建的 `authorized_keys` 文件中

- 修改 `.ssh` 文件夹与 `authorized_keys` 文件的权限，使得我们能够正常的进行访问

```bash
#给.ssh 文件夹设置权限
chmod 700 .ssh
#给authorized_keys 文件设置权限
chmod 600 authorized_keys
```

现在客户端与服务端的配置已经基本处理完毕了，你现在可以直接在客户端中使用 `ssh` 命令来登录到服务器中了。（无需输入密码）

```bash
# rot 是 config 文件中 Host 中使用的别名
ssh rot 
```

如果在登录服务器中出现什么问题，请在[扩展阅读](#扩展阅读)中的错误文章中排查一下。

## Git 服务配置

- 在服务器上创建一个用于存放 `裸仓库` 的文件夹，这个仓库的文件就是我们客户端需要访问的 git 仓库地址。`裸仓库` 使用 `git init --bare name.git` 来进行创建的。
  > 我这边是在 `home` 文件夹中创建了一个 `gitServer` 的文件夹

- 创建一个 `裸仓库`
  
```bash
# 进入到刚才创建用于存放裸仓库的文件中，执行以下命令
git init --bare test.git
```

- 进入到创建好的裸仓库中，在 `.git/hook` 文件夹中创建文件 `post-receive`，这个文件是用于监听客户端的 `git push` 操作，如果客户端执行了这个命令，那么就会执行这个文件中的内容。

- 编写 `post-receive` 文件中的内容
- 
```bash
#!/bin/sh

unset GIT_DIR

NowPath=`pwd`
DeployPath="/home/user/product/test"

cd $DeployPath
git init
git remote add origin /home/gitServer/test.git
git clean -df
git pull origin master
exit 0
```

- 将 `post-receive` 文件添加可执行权限

```bash
chmod +x post-receive
```

- 创建 git 仓库

> 我这边是在 `/home/user/product` 中创建 git 仓库的

```bash
mkdir test && cd test
git init
git clone /home/gitServer/test.git
```
以上命令执行完毕之后，一个 git 仓库就创建完毕了，**服务端中需要进行的操作也就完成了。**

- 在客户端中我们就可以使用以下命令去获取在服务器中创建的 gti 仓库了

```bash
git remote add prod root@192.168.62.128:/home/gitServer/test.git

git push prod master
```


## 扩展阅读
- [基本搭建](https://purewhite.io/2017/04/27/git-hooks-auto-deploy/)
- [错误排查](http://m.bubuko.com/infodetail-3340199.html)