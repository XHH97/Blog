# 第二章 简单的 HTTP 协议

## HTTP 协议用于客户端和服务端之间的通信

* 请求访问文本或图像等资源的一端称之为客户端，而提供资源响应的一方称之为服务器端
  > 客户端的定义在上一章节中也有指出

* 在两台计算机之间使用 HTTP 协议通信时，在一条通信线路上必定有一端是客户端，另一端则是服务器端。

  ![客户端 && 服务端](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%BA%8C%E7%AB%A0/%E5%AE%A2%E6%88%B7%E7%AB%AF%20%26%26%20%E6%9C%8D%E5%8A%A1%E7%AB%AF.png)

## 通过请求和响应的交换达成通信

* HTTP 协议规定，请求从客户端发出，最后服务器响应该请求并返回。换句话说，**肯定是从客户端开始建立通信的，服务端在没有接收到请求之前不会发送响应。**

* **请求报文是由请求方法、请求 URI、协议版本、可选的请求首部字段和内容实体构成。**

![请求报文的构成](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%BA%8C%E7%AB%A0/%E8%AF%B7%E6%B1%82%E6%8A%A5%E6%96%87%E7%9A%84%E6%9E%84%E6%88%90.png)

* **响应报文基本上由协议版本、状态码（表示请求成功或失败的数字代码）、泳衣解释状态码的原因短语、可选的响应首部字段以及实体主体构成。**

![响应报文的构成](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%BA%8C%E7%AB%A0/%E5%93%8D%E5%BA%94%E6%8A%A5%E6%96%87%E7%9A%84%E6%9E%84%E6%88%90.png)

## HTTP 是不保存状态的协议

* HTTP 是一种不保存状态，即无状态（stateless）协议。HTTP 协议自身不对请求和响应之间的通信状态进行保存。也就是说在 HTTP 这个级别，**协议对于发送过的请求或响应都不做持久化处理**。

* 使用 HTTP 协议，每当**有新的请求发送时，就会有对应的新响应产生。协议本身并不保留之前一切的请求或响应报文的信息**。这是为了**更快地处理大量事务，确保协议的可伸缩性**，而特意把 HTTP 协议设计成如此简单。

## 请求 URI 定位资源

* HTTP 协议使用 URI 定位互联网上的资源。
  > 关于 URI 在上一章节中也有解释

* 当客户端请求访问资源而发送请求时，URI 需要作为请求报文中的请求 URI 包含在内。如果不是访问特定资源而是对服务器本身发起请求，可以用 `*` 来代替请求 URI。

## 告知服务器意图的 HTTP 方法

| 方法    | 作用                     | 说明                                                                                                                                                                                                                                     |
| :------ | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET     | 获取资源                 | **GET 方法用来请求访问已被 URI 识别的资源。指定的资源经服务器端解析后返回响应内容**。 也就是说，如果请求的资源是文本，那就保持原样返回； 如果是像 CGI（ Common Gateway Interface，通用网关接口）那样的程序，则返回经过执行后的输出结果。 |
| POST    | 传输实体主体             | 虽然用 GET 方法也可以传输实体的主体，但一般不用 GET 方法进行传输，而是用 POST 方法。虽说 POST 的功能与 GET 很相似，**但POST 的主要目的并不是获取响应的主体内容**。|
| PUT     | 传输文件                 |PUT 方法用来传输文件。就像 FTP 协议的文件上传一样，要求在请求报文的主体中包含文件内容，然后保存到请求 URI 指定的位置。但是，**鉴于 HTTP/1.1 的 PUT 方法自身不带验证机制，任何人都可以上传文件 , 存在安全性问题，因此一般的 Web 网站不使用该方法**。若配合 Web 应用程序的验证机制，或架构设计采用 REST（ REpresentational State Transfer，表征状态转移）标准的同类 Web 网站，就可能会开放使用 PUT 方法。
| HEAD    | 获取报文首部             |HEAD 方法和 GET 方法一样，只是不返回报文主体部分。用于确认 URI 的有效性及资源更新的日期时间等。
| DELETE  | 删除文件                 |DELETE 方法用来删除文件，是与 PUT 相反的方法。 DELETE 方法按请求 URI 删除指定的资源。但是， **HTTP/1.1 的 DELETE 方法本身和 PUT 方法一样不带验证机制，所以一般的 Web 网站也不使用 DELETE 方法**。当配合 Web 应用程序的验证机制，或遵守 REST 标准时还是有可能会开放使用的。
| OPTIONS | 询问支持方法             |OPTIONS 方法用来查询针对请求 URI 指定的资源支持的方法。**这个方法会在 GET、POST 等方法发送的时候提前发送，这也就到为什么有些时候 POST 方法会发送两次请求的原因（其中有一次是 OPTIONS 请求）**
| TRACE   | 追踪路径                 |TRACE 方法是让 Web 服务器端将之前的请求通信环回给客户端的方法。<br />发送请求时， 在 Max-Forwards 首部字段中填入数值，每经过一个服务器端就将该数字减 1， 当数值刚好减到 0 时，就停止继续传输，最后接收到请求的服务器端则返回状态码 200 OK 的响应。<br />客户端通过 TRACE 方法可以查询发送出去的请求是怎样被加工修改 / 篡改的。这是因为，请求想要连接到源目标服务器可能会通过代理中转， TRACE 方法就是用来确认连接过程中发生的一系列操作。<br />但是， TRACE 方法本来就不怎么常用，再加上它容易引发 XST（ Cross-Site Tracing，跨站追踪）攻击，通常就更不会用到了。
| CONNECT | 要求使用隧道协议连接代理 |CONNECT 方法要求在与代理服务器通信时建立隧道，实现用隧道协议进行 TCP 通信。主要使用 SSL（ Secure Sockets Layer，安全套接层）和 TLS（ Transport Layer Security，传输层安全）协议把通信内容加密后经网络隧道传输。

## 使用方法下达命令

* 向请求 URI 指定的资源发送请求报文时，采用成为方法的命令。方法的作用在于，可以指定请求的资源按期望产生某种行为。
  > 具体 HTTP 协议有哪些方法，在上一小节已经有提出了。

HTTP 协议通信方法表：
|  方法   |           说明           | 支持的HTTP协议版本 |
| :-----: | :----------------------: | :----------------- |
|   GET   |         传输资源         | 1.0、1.1           |
|  POST   |       传输实体主体       | 1.0、1.1           |
|   PUT   |         传输文件         | 1.0、1.1           |
|  HEAD   |       获取报文首部       | 1.0、1.1           |
| DELETE  |         删除文件         | 1.0、1.1           |
| OPTIONS |       询问支持方法       | 1.0、1.1           |
|  TRACE  |         追踪路径         | 1.1                |
| CONNECT | 要求使用隧道协议连接代理 | 1.1                |
|  LINK   |   建立和资源之间的联系   | 1.0（废除）        |
| UNLINK  |       断开连接关系       | 1.0（废除）        |

## 持久连接节省通信量

* 在 HTTP 协议的初始版本中，每进行一次 HTTP 通信就要断开一次 TCP 连接。也就是说客户端与服务器端的每次通信，客户端发起的每次请求都会造成无谓的 TCP 连接建立和断开，这样也增加通信量的开销。

![TCP 在通信时候的连接](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%BA%8C%E7%AB%A0/TCP%20%E5%9C%A8%E9%80%9A%E4%BF%A1%E6%97%B6%E5%80%99%E7%9A%84%E8%BF%9E%E6%8E%A5.png)

### 持久连接

* 为了 TCP 连接的问题，HTTP/1.1 和一部分的 HTTP/1.0 想出了持久连接（HTTP Persistent Connections，也成为 HTTP keep-alive 或 HTTP connection reuse）的方法。持久连接的特点是：**只要任意一段没有明确提出断开连接，则保持 TCP 连接状态**。

  #### 持久连接优点

  * 减少了 TCP 连接的重复建立和断开所造成的额外开销，减轻了服务器端的负载
  * 减少开销的那部分事件，是 HTTP 请求和响应能够更早地结束，这样 Web 页面的显示速度也就相应的提高了

* **在 HTTP/1.1 中，所有的连接默认都是持久连接，但在 HTTP/1.0 内未标准化。**

![持久连接节省通信量](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%BA%8C%E7%AB%A0/%E6%8C%81%E4%B9%85%E8%BF%9E%E6%8E%A5%E8%8A%82%E7%9C%81%E9%80%9A%E4%BF%A1%E9%87%8F.png)

### 管线化

* 持久连接使得多数请求译管线化（pipelining）方式发送成为可能。从前**客户端发送请求后需等待并受到服务器端的响应，才能发送下一个请求**。管线化技术出现后，**不需要等待服务器端响应即可直接发送下一个请求**。

* 与一个一个连接相比，用持久连接可以让请求更快结束。而管线化技术则比持久连接还要快。**请求数越多，时间差越明显**。

![管线化](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%BA%8C%E7%AB%A0/%E7%AE%A1%E7%BA%BF%E5%8C%96.png)

## 使用 Cookie 的状态管理

> 每次客户端与服务端通信时都会进行携带，可能会造成不必要的通信损失

* HTTP 是无状态协议，它不对之前发生过的请求和响应的状态进行管理。也就是说无法根据之前的状态进行本次的请求处理。

* 不可否认，无状态协议当然也有它的有点。由于不必保存状态，自然可减少服务器的 CPU 及内存资源的消耗。从另一方面来说，也正是应为 HTTP 协议本身是非常简单的，所以才会被应用在各种场景。

* Cookie 技术通过在请求和响应报文中写入 Cookie 信息来控制客户端的状态。

* Cookie 会根据从服务器端发送的响应报文内的一个叫做 `Set-Cookie` 的首部字段信息，通知客户端保存 Cookie。当下次客户端在往服务器端发送请求时，客户端会自动在请求报文中加入 Cookie 值后发送出去。

![Cookie 保存 HTTP 通信状态](https://xhh-image-1258151134.cos.ap-nanjing.myqcloud.com/Markdown%20image/%E5%9B%BE%E8%A7%A3%20HTTP/%E7%AC%AC%E4%BA%8C%E7%AB%A0/Cookie%20%E4%BF%9D%E5%AD%98%20HTTP%20%E9%80%9A%E4%BF%A1%E6%97%B6%E7%9A%84%E7%8A%B6%E6%80%81.png)

## 扩展阅读

* [Cookie](https://zh.wikipedia.org/wiki/Cookie)
