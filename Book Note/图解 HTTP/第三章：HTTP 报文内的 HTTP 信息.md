# 第三章：HTTP 报文内的 HTTP 信息

## HTTP 报文

* 用于 HTTP 协议交互的信息称为 HTTP 报文。请求端（客户端）的 HTTP 报文叫`请求报文`，响应端（服务器端）的叫`响应报文`。HTTP 报文本身是由多行（用 CR+LF 作换行符）数据构成的字符串文本。HTTP 报文大致可分为报文首部和报文主体两块。两者由最初出现的空行（CP+LF）来划分。

## 请求报文及响应报文的结构

**请求报文结构**：

* 报文首部
  * 请求行
  * 请求首部字段
  * 通用首部字段
  * 实体首部字段
  * 其他
* 空行(CR+LF)
* 报文主体（内容实体）

**响应报文结构**：

* 响应首部
  * 状态行
  * 响应首部字段
  * 通用首部字段
  * 实体首部字段
  * 其他
* 空行(CR+LF)
* 报文主体（内容实体）

以上的结构我们使用以下几个部分进行介绍：

* 请求行    - 包含请求的方法，请求 URI 和 HTTP 版本
* 状态行    - 包含表明响应结果的状态码，原因短语和 HTTP 版本
* 首部字段  - 包含表示请求和响应的各种条件和属性的各类首部。一般有4个首部，分别是：`请求首部`，`响应首部`，`通用首部`和`实体首部`。
* 其他     - 可能包含 HTTP 的 [RFC](#扩展阅读) 李未定义的首部（Cookie 等）。

![请求报文（上）和响应报文（下）的结构](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%B8%89%E7%AB%A0/%E8%AF%B7%E6%B1%82%E6%8A%A5%E6%96%87%EF%BC%88%E4%B8%8A%EF%BC%89%E5%92%8C%E5%93%8D%E5%BA%94%E6%8A%A5%E6%96%87%EF%BC%88%E4%B8%8B%EF%BC%89%E7%9A%84%E7%BB%93%E6%9E%84.png)

## 编码提升传输速率

* HTTP 在传输数据是可以按照数据原貌直接传输，但也可以在传输过程中通过编码提升传输速率。通过在传输时编码，能有效地处理大量的访问请求。但是，**编码的操作需要计算机来完成，因此会消耗更多的 CPU 等资源**。

### 报文主体和实体主体的差异

* 报文（message）
    是 HTTP 通信中的基本单位，由 8 位组字节流（octet sequence）组成，通过 HTTP 通信传输。
* 实体（entity）
    作为请求或响应的有效载荷数据（补充项）被传输，其内容有`实体首部`和`实体主体`组成。

* HTTP 报文的主体用于传输请求或响应的实体主体。通常，报文主体等于实体主体。只有当传输中进行编码操作时，实体主体的北荣发生变化，才导致它和报文主体产生差异。

### 压缩传输的内容编码

* HTTP 协议中有一种被称为`内容编码`的功能，该功能指明应用在试题内容上的编码格式，并保持实体信息原样压缩。内容编码后的实体由客户端接收并负责解码。

常用的内容编码有以下几种:

* gzip（GNU zip）
* compress（UNIX 系统的标准压缩）
* deflate（zlib）
* identity（不进行编码）

![内容编码](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%B8%89%E7%AB%A0/%E5%86%85%E5%AE%B9%E7%BC%96%E7%A0%81.png)

### 分割发送的分块传输编码

* 在 HTTP 通信过程中，请求的编码实体资源尚未全部传输完成之前，浏览器无法显示请求页面。在传输大容量数据时，通过把数据分割成多块，能够让浏览器逐步显示页面。这种把实体分块的功能称为`分块传输编码`（Chunked Transfer Coding）。

* 分块编码会将实体主体分成多个部分（块）。每一块都会用十六进制来标记块的大小，而实体的最后一块会使用“0（CR+LF）”来标记。

* 使用分块编码的实体主体会由接收的客户端负责解码，恢复到编码前的实体主体。HTTP/1.1 中存在一种称为`传输编码`（Transfer Coding）的机制，它可以在通信是按某种编码方式传输，但只定义作用于分块传输编码中。

![分块传输编码](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%B8%89%E7%AB%A0/%E5%88%86%E5%9D%97%E4%BC%A0%E8%BE%93%E7%BC%96%E7%A0%81.png)

## 发送多种数据的多部分对象集合

* HTTP 协议中也采纳了多部分对象几个，发送的一份报文主体可包含有多类型实体。通常是在图片或文本文件等上传时使用。

  **多部分对象集合包含的对象如下**：
  * multipart/form-data   - 在 Web 表单文件上传时使用
  * multipart/byteranges  - 状态码 206（Partial Content，部分内容）响应报文包含了多个范围的内容时使用

* HTTP 报文中使用多部分对象集合时，需要在首部字段里加上 `Content-type`；使用 `boundary` 字符串来划分多部分对象集合指明的各类实体。在 `boundary` 字符串指定的各个实体的起始行之前插入“--”标记（例如：--AaB03x、--THIS_STRING_SEPARATES），而在多部分对象集合对象的字符串的最后插入“--”标记（例如：--AaB03x--、--THIS_STRING_SEPARATES--）作为结束。

* 多部分对象集合的每个部分类型中，都可以含有首部字段。另外，可以在某个部分中嵌套使用多部分对象集合。[多对象合集解释](#扩展阅读)

## 获取部分内容的范围请求

* 针对范围请求，响应会返回状态码 206 Partial Content 的响应报文。另外对于多重范围的范围请求，响应会在首部字段 Content-type 中标明 multipart/byteranges 后返回响应报文。如果服务器端无法响应范围请求，这回返回状态码 200 OK 和完整的实体内容。

## 内容协商返回最合适的内容

* 当浏览器的默认语言为英文或中文，访问相同的 URI 的 Web 页面时，则会显示对应的英文版或中文版的 Web 页面。这样的机制称为`内容协商`（Content Negotiation）

* 内容协商机制是指客户端和服务端就响应的资源内容进行交涉，然后提供给客户端最为合适的资源。内容协商会以响应资源的语言、字符集、编码方式等作为判断的基准。

**以下字段是会作为包含在请求报文中的判断基准**：

* Accept
* Accept-Charset
* Accept-Encoding
* Accept-Language
* Content-Language

**内容协商的3种类型**：

* 服务器驱动协商（Server-driven Negotiation）
    由服务器端进行内容协商。以请求的首部字段为参考，在服务器端自动处理。但对用户来说，以浏览器发送的信息作为判定的依据，并不一定能筛选出最优内容。
* 客户端驱动协商（Agent-driven Negotiation）
    由客户端进行内容协商的方式。用户从浏览器显示的可选项列表中手动选择。还可以利用 JavaScript 脚本在 Web 页面上自动进行上述选择。比如按 OS 的类型或浏览器类型，自行切换成 PC 版页面或手机版页面。
* 透明协商（Transparent Negotiation）
    是服务器驱动和客户端驱动的结合体，是由服务器端和客户端各自进行内容协商的一种方法。

## 扩展阅读

[RFC - 请求意见稿](https://zh.wikipedia.org/wiki/RFC)
[RFC2046 - 多对象集合](https://zh.wikipedia.org/wiki/%E5%A4%9A%E7%94%A8%E9%80%94%E4%BA%92%E8%81%AF%E7%B6%B2%E9%83%B5%E4%BB%B6%E6%93%B4%E5%B1%95)

## TODO

* [ ] 弄清楚报文和实体
