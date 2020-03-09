# 八、fetch Api

浏览器提供全局 fecth 方法，可以看做是 XMLHttpRequest 的替代品。

它与后者的区别主要有三点：

1、 接收到错误的状态时，比如 404 或者 500错误，fecth 方法返回的 promise 也不会标记为 reject 状态，而是 resolve 状态。除非遇到网络故障。

2、fetch() 不会接受跨域 cookies；你也不能使用 fetch() 建立起跨域会话。其他网站的 Set-Cookie 头部字段将会被无视。

3、fetch 不会发送 cookies。除非你使用了credentials 的初始化选项。

## Response 对象

```
fetch('/data', {
    body: JSON.stringify({name: 'xxx'}),
    method: 'POST'
  }).then(res => {
    console.log(res)
    return res.text()
  }).then(rs => {
    console.log(rs)
  })
```

打印出来 fetch 返回的 response 如下：

```
  type: "basic"
  url: "http://localhost:3001/data"
  redirected: false
  status: 200
  ok: true
  statusText: "OK"
  headers: Headers {}
  body: ReadableStream
  bodyUsed: true
  __proto__: Response

```
### type

type 代表响应类型，是通过 config 中的 mode 请求模式设置的。

当 config 中 mode 设置为： 

* 'cors' 谷歌浏览器 47 版本之后默认。
* 'no-cors' 该模式用于跨域请求但是服务器不带CORS响应头，也就是服务端不支持CORS；这也是fetch的特殊跨域请求方式
* 'same-origin' 浏览器不支持跨域，需要遵守同源策略

请求成功后返回的 response 分别对应为：
* 'cors'
* 'opaque'
* 'basic'

### status *

Response.status — 整数（默认值为200）为response的状态码。

Response.statusText — 字符串（默认值为"OK"），该值与 HTTP 状态码消息对应。

Response.ok — 如上所示，该属性是来检查response的状态是否在 200 - 299（包括200 和 299）这个范围内。该属性返回一个布尔值。

### body

body 对象定义了以下方法：

```
  arrayBuffer()
  blob()
  json()
  text()
  formData()
```
response 实现了这些方法，这也是我们能通过 response.text() 获取 body 所返回数据的原因。 

当前我们传参的时候也可以作为 Request 的一个选项。

## Request 对象

fetch() 方法的第一个参数是url，第二个参数即为请求配置项。

我们使用 fecth 的时候也可以直接创建一个 Request 对象并传入 fetch。

```
  var myHeaders = new Headers();

  var myInit = { method: 'GET',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default' };

  var myRequest = new Request('flowers.jpg', myInit);

  fetch(myRequest).then(function(response) {
    return response.blob();
  }).then(function(myBlob) {
    var objectURL = URL.createObjectURL(myBlob);
    myImage.src = objectURL;
  });
```

上个例子等同于：
```
  fetch('flowers.jpg', myInit)
```

Request() 构造器创建一个新的Request 对象。

```
  var myRequest = new Request(input, init);
```

input 为资源的URL

init 为可选项，可用的选项如下：

* method: 请求的方法，例如：GET, POST。
* headers: 任何你想加到请求中的头，其被放在Headers对象或内部值为ByteString 的对象字面量中。
* body: 任何你想加到请求中的body，可以是Blob, BufferSource, FormData, URLSearchParams, 或 USVString对象。注意GET 和 HEAD请求没有body。
* mode: 请求的模式, 比如 cors, no-cors, same-origin, 或 navigate。默认值应该为 cors。但在Chrome中，Chrome 47 之前的版本默认值为 no-cors ，自Chrome 47起，默认值为same-origin。
* credentials: 想要在请求中使用的credentials：: omit, same-origin, 或 include。默认值应该为omit。但在Chrome中，Chrome 47 之前的版本默认值为 same-origin ，自Chrome 47起，默认值为include。
* cache: 请求中想要使用的cache mode 
* redirect: 对重定向处理的模式： follow, error, or manual。在Chrome中，Chrome 47 之前的版本默认值为 manual ，自Chrome 47起，默认值为follow。
* referrer: 一个指定了no-referrer, client, 或一个 URL的 USVString 。默认值是client.
* integrity: 包括请求的 subresource integrity 值 (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).

## Headers 对象

fetch 的配置项中有 headers 选项，该选项定义请求头。它可以通过全局的 Headers 构造函数创建。

```
  var myHeaders = new Headers(init);
```

init 通过一个包含任意 HTTP headers 的对象来预设你的 Headers. 可以是一个ByteString 对象; 或者是一个已存在的 Headers 对象。

eg: 

```
  var myHeaders = new Headers(); // Currently empty

  myHeaders.append('Content-Type', 'image/jpeg');
  myHeaders.get('Content-Type'); // Returns 'image/jpeg'
```