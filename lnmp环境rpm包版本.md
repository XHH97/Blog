nginx
mysql
php
node
git

安装php
首先我们使用rpm -qa | grep php* 查看有没有安装过其他版本的php，如果有使用rpm remove php*进行卸载

获取带有的php的rpm包
依次执行  rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm

上述操作完成之后, 就可以直接使用yum install php70w来安装php7.0版本了，如果直接使用yum install php70w*则会安装所有的插件包，在安装的过程中如果遇到冲突问题，按照提示进行过滤冲突即可

ALTER USER 'root'@'localhost' IDENTIFIED BY 'XuHaO970704.';