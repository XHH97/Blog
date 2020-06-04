# lnmp环境搭建

> 该环境全部自定义进行安装，也会有一篇是使用爆进行安装的

## 我们主要安装的环境有

  1. Nginx    web服务器，用来跑我们的web服务  版本: 1.16.0
  2. PHP      wordpress网站的必须品         版本: 7.2.19
  3. Mysql    数据库软件                    版本: 5.7.22
  4. NodeJS   前端必备                      版本: 10.16.0
  5. Git      让我们可以从Git服务器上上传，下载文件，不用使用FTP软件进行项目文件的更新   版本: 2.9.5
  6. libiconv   版本: 1.15
  7. libxml2    版本: 2.7.2
  8. openssl    版本: 1.1.1c
  9. pcre       版本: 8.43
  10. zlib      版本: 1.2.11

## 环境安装之前需要准备的东西

  1. 环境运行的基础包  减少我们在安装环境包的时候出现的错误，增加不必要的时间

      ```cmd
      sudo yum install gcc gcc-c++ make sudo autoconf libtool-ltdl-devel gd-devel freetype freetype-devel libxml2-devel libjpeg libjpeg-devel libpng libpng-devel openssl-devel curl curl-devel patch libmcrypt-devel libmhash-devel ncurses-devel bzip2 libcap-devel libicu  libicu-devel libxslt libxslt-devel* ntp sysklogd diffutils sendmail iptables unzip cmake boost -y
      ```

  2. 相应文件夹创建   创建我们的项目文件夹，下载的文件存放目录，软件安装目录
      1. www
      2. source
      3. lnmp
      4. download

      ```cmd
      mkdir www
      mkdir source
      mkdir lnmp
      mkdir download
      ```

  3. 防火墙端口的开启
      1. mysql的3306端口
      2. 网站访问的80端口
      3. 如果还需要其他端口可以开启8000-9000的端口(这个看自己的需求了)

      ```cmd
      systemctl start firewalld   开启防火墙(默认是没有开启的)
      systemctl enable firewalld  开机启动防火墙
      firewall-cmd --zone=public --add-port=80/tcp --permanent  开启一个80端口且永久生效，端口的协议可以设置成UDP
      firewall-cmd --zone=public --add-port=3306/tcp --permanent  开启一个80端口且永久生效
      firewall-cmd --zone=public --add-port=8000-9000/tcp --permanent  开启一个80端口且永久生效

      systemctl restart firewalld  防火前重启一下

      firewall-cmd -list-list   查看防火墙的所有信息
      firewall-cmd -list-port   查看已经开启的端口
      ```

  4. 用户及用户组的创建
      1. mysql用户和mysql用户组的创建
      2. www用户和www用户组的创建

      ```cmd
      groupadd mysql    创建mysql用户组
      useradd -r mysql -g mysql   创建mysql用户，且是在mysql用户组下
      groupadd www
      useradd -r www -g www
      cat /etc/group
      cat /etc/passwd
      chown -R www:www /home/www
      ```

## 环境包安装

### Nginx

#### 安装基础包 pcre

  ```cmd
  cd /***/lnmp/pcre
  ./configure
  make
  make install
  ```

#### 安装基础包 openssl

  ```cmd
  cd /***/lnmp/openssl
  ./config
  make
  make install
  ```

#### 安装基础包 zlib

  ```cmd
  cd /***/lnmp/zlib
  CFLAGS="-O3 -fPIC" ./configure
  make && make install
  ```

#### 安装Nginx软件包

  Nginx安装之前需要我们手动去配置一些模块，详细的请看下面。

  ```cmd
  --prefix=PATH      要安装到的目录
  --sbin-path=PATH   指定nginx二进制文件的路径，没指定的话这个路径依赖 --prefix 选项
  --conf-path=PATH   如果在命令行未指定配置文件，那么将会通过 --prefix 指定的路径去查找配置文件
  --error-log-path=PATH  错误文件路径，nginx写入错误日志文件地址
  --pid-path=<path>   nginx master进程pid写入的文件位置，通常在var/run下
  --user=<user>       worker进程运行的用户
  --group=<group>     worker进程运行的组
  --with-http_ssl_module 开启 ssl 模块
  --with-zlib=DIR 设置 zlib 的源码目录
  --with-openssl=DIR  设置 openssl 的源码目录
  --with-pcre=DIR设置 pcre 的源码目录
  --with-http_ssl_module  开启https模块
  --with-http_mp4_module  支持mp4文件
  --with-http_gzip_static_module  支持gzip
  --http-log-path=PATH  http日志文件存放路径
  --with-mail    开启SMTP模块
  --with-mail_ssl_module  开启SMTP的SSL协议
  --with-debug   记录dubug
  ```

  在nginx文件下面运行下面的命令，关于路径的字段根据同人的使用需要进行修改，请注意

  ```cmd
  ./configure --user=www --group=www --prefix=/home/source/nginx --error-log-path=/home/source/nginx/logs/err.log --pid-path=/home/source/nginx/logs/nginx.pid --with-pcre=/home/lnmp/pcre --with-zlib=/home/lnmp/zlib --with-openssl=/home/lnmp/openssl --with-http_ssl_module --with-http_mp4_module --with-http_gzip_static_module --http-log-path=/home/source/nginx/logs/http.log --with-mail=dynamic --with-mail_ssl_module --with-debug

  make && make install  使用make进行软件包的安装
  ```

  上面的命令执行完成之后，我们需要将nginx进行一个软连接，这样我们就可以直接使用Nginx命令了

  ```cmd
  ln -s /***/source/nginx/sbin/nginx /usr/bin

  在启动nginx之前我们需要使用命令
  nginx -c /***/nginx/conf/nginx.conf
  nginx -s reload 启动nginx
  ```

#### 安装Mysql软件包

wget boot-

cmake -DDOWNLOAD_BOOST=1 -DWITH_BOOST=/home/lnmp/boost -DCMAKE_INSTALL_PREFIX=/home/source/mysql

rm -f /etc/my.cnf  // 删除默认配置
/home/source/mysql/bin/mysqld --initialize --user=mysql --basedir=/home/source/mysql  --datadir=/home/source/mysql/data/ 初始化

cp support-files/mysql.server /etc/init.d/mysqld
使用service启动服务
? 如何添加systemctl启动
vim /etc/profile
export PATH="/www/source/mysql/bin:$PATH"
source /etc/profile

dcQFq<eH2jFq

#### 安装PHP软件包

./configure --prefix=/home/source/php --with-fpm-user=www --with-fpm-group=www --with-config-file-path=/home/source/php/bin/php-config --with-curl --with-freetype-dir --with-gd --with-gettext --with-kerberos --with-libdir=lib64 --with-libxml-dir --with-mysqli --with-pcre-regex --with-pdo-mysql --with-pdo-sqlite --with-pear  --with-png-dir --with-xmlrpc --with-xsl --with-mhash --with-jpeg-dir --enable-fpm --enable-bcmath --enable-libxml --enable-inline-optimization --enable-mbregex --enable-mbstring --enable-opcache --enable-pcntl --enable-shmop --enable-soap --enable-sockets --enable-sysvsem --enable-xml --enable-ftp --enable-intl --enable-mysqlnd --disable-rpath --disable-fileinfo --with-mysqli=mysqlnd --enable-maintainer-zts --with-zlib-dir=/usr/share/doc/zlib --with-mysqli=mysqlnd

make ZEND_EXTRA_LIBS='-liconv -lssl'

make clean

cp etc/php-fpm.conf.default etc/php-fpm.conf
cp etc/php-fpm.d/www.conf.default etc/php-fpm.d/www.conf
cp /home/www/lnmp/php-7.2.19/php.ini-production /home/www/source/php/lib/php.ini
ln -s /home/www/source/php//sbin/php-fpm /usr/bin


Node

yum install epel-release
yum install nodejs
yum install npm

wget https://nodejs.org/dist/v10.16.0/node-v10.16.0.tar.gz
tar -zxvf node-*
yum install gcc gcc-c++ -y
./configure --prefix=/home/www/source/node


  HTTP2:
    Flags that allows you to control HTTP2 features in Node.js

    --debug-nghttp2     build nghttp2 with DEBUGBUILD (default is false)


Git

  yum install git

## 小技巧
  
  1. 快速解压压缩tar.gz文件

  ```cmd
  find ./*.tar.gz -exec tar zxvf {} \;  快速解压tar.gz文件
  ```

  2.  查看源码安装帮助及快速安装

  ```cmd
  ./configure --help
  make && make install
  ```

  3. ln: failed to create symbolic link 问题解决

  ```cmd
  unlink /usr/bin/name
  ln -s /***/name /usr/bin
  ```

  4. Nginx 伪静态配置

  >将下面的代码放入到nginx.conf的service模块里面

  ```nginx
  try_files $uri $uri/ @rewrite;

  location @rewrite {
    rewrite ^/(.*)$ /index.php?_url=/$1;
  }
  ```

  5. off_t undefined; check your library configuration问题解决

  >这个问题在网站上搜索了很久，但是没有解决，后面讲--enable-zip项去掉之后就解决了, 下面的是网络上一致的解决方案, 这个问题也有人说是libzip包的版本不对，需要将版本下降。

  ```cmd
  添加搜索路径到配置文件
  echo '/usr/local/lib64
  /usr/local/lib
  /usr/lib
  /usr/lib64'>>/etc/ld.so.conf
  更新配置
  ldconfig -v
  ```

  6. 错误Cannot find OpenSSL's libraries解决办法

  ```cmd
  find / -name libssl.so   查找openssl安装位置
  ln -s /usr/lib64/libssl.so /usr/lib  软连接
  ```
