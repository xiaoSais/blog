# 跨域资源共享（cors）

## 简介

首先 cors 是在 IE 10 + 浏览器上才可以工作。<b>并且前端不用做任何改造。</b> cors 允许你跨域去访问一个接口，只是后端要做些许调整。cors 将 client 的http 请求分为两种 简单请求 && 预检请求。

## 简单请求

符合以下条件的请求为简单请求：

请求方法为：<b>get</b> | <b>post</b> | <b>head</b> 之一。

请求头为：
* Accept
* Accept-Language
* Content-Language
* Content-Type
* DPR
* Downlink
* Save-Data
* Viewport-Width
* Width

中的<b>0个或多个</b>。

如果存在 Content-Type 请求头，其值只能是以下之一：
* text/plain
* multipart/form-data
* application/x-www-form-urlencoded

eg: Client.js （客户端端口在3001）

```js
  var xhr = new XMLHttpRequest()
  xhr.open('get','http://localhost:3000/login',true)
  xhr.setRequestHeader('Content-Type', 'text/plain');
  xhr.onload = function(e){
    if(e.currentTarget.status==200){
      alert(e.currentTarget.responseText)
    }
  }
  xhr.send()
```
客户端发起了一个 get 请求，并甚至请求头 Content-Type 字段为 text/plain，属于简单请求。

Server.js (端口在3000)
```js
  app.get('/login', (req,res) => {
  res.set('Access-Control-Allow-Origin','*')
  // res.set('Access-Control-Allow-Origin','http://localhost:3001')
  res.send('in get 3000')
})
```
对于简单请求，服务端需要设置响应头 Access-Control-Allow-Origin，'*' 代表支持所有的域访问，也可以具体设置某个域。

客户端发起跨域请求后，cors 策略会自动加上 origin 字段的请求头，表示该请求来源于哪个地址。

Request Header
```
GET /login HTTP/1.1
Host: localhost:3000
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36
Sec-Fetch-Dest: empty
Accept: */*
Origin: http://localhost:3001
Sec-Fetch-Site: same-site
Sec-Fetch-Mode: cors
Referer: http://localhost:3001/
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
```

而服务端设置的响应头就是根据该字段来决定这次跨域请求是否成功，如果Access-Control-Allow-Origin 设置的域和 origin 请求头一致该跨域请求就会成功发送。

## 预检请求

不属于简单请求的跨域请求都属于预检请求。预检请求会先发送一个 options 请求到服务器，以便于获知是否允许该实际请求，可以避免跨域请求对服务器的用户数据产生未预期的影响。

eg: Client.js

```js
  var xhr = new XMLHttpRequest()
  xhr.open('put','http://localhost:3000/login',true)
  xhr.setRequestHeader('test', 'text/plain');
  xhr.onload = function(e){
    if(e.currentTarget.status==200){
      alert(e.currentTarget.responseText)
    }
  }
  xhr.send()
```

客户端发起了一个 put 请求，并设置自定义请求头 'test'，属于预检请求。

Server.js

服务端必须能够处理该路由的 options 请求，并设置 Access-Control-Allow-Origin（必须）、Access-Control-Allow-Methods（必须）、Access-Control-Allow-Headers（非必须） 字段

同时 put 方法也要设置 Access-Control-Allow-Origin 的响应头。

```js
  app.options('/login',function(req,res){
    res.set('Access-Control-Allow-Origin','*')  //必须设置
    res.set('Access-Control-Allow-Methods','PUT') //必须设置
    res.set('Access-Control-Allow-Headers','test') //如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。
    console.log('xxxxx')
    res.send('optins')
  })

  app.put('/login', (req, res) => { 
    res.set('Content-Type', 'application/json')
    res.set('Access-Control-Allow-Origin', '*')
    // res.set('Access-Control-Max-Age', '86400')
    console.log('in login')
    res.send('ccccc')
  })
```


预检请求中同时携带了下面两个首部字段：
```
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

首部字段 Access-Control-Request-Method 告知服务器，实际请求将使用 POST 方法。首部字段 Access-Control-Request-Headers 告知服务器，实际请求将携带两个自定义请求首部字段：X-PINGOTHER 与 Content-Type。服务器据此决定，该实际请求是否被允许。

put 请求的响应头
```
HTTP/1.1 200 OK
X-Powered-By: Express 
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: test
Content-Length: 5
ETag: W/"5-rtTvO5DXQ5DhJfCLdJEqZbN2CGk"
Date: Mon, 02 Mar 2020 08:07:11 GMT
Connection: keep-alive
```

首部字段 Access-Control-Allow-Methods 表明服务器允许客户端使用 PUT 方法发起请求。

首部字段 Access-Control-Allow-Headers 表明服务器允许请求中携带字段 test 。Access-Control-Allow-Methods 一样，Access-Control-Allow-Headers 的值为逗号分割的列表。

## 带 cookie 的预检请求

eg: Client.js
```js
  var xhr = new XMLHttpRequest()
  xhr.open('put','http://localhost:3000/login',true)
  xhr.setRequestHeader('test', 'text/plain');
  xhr.withCredentials = true;
  xhr.onload = function(e){
    if(e.currentTarget.status==200){
      alert(e.currentTarget.responseText)
    }
  }
  xhr.send()
```

客户端发起带 cookie 的预检请求，需要设置 xhr 的 withCredentials 属性为true。

Server.js

```js
  app.options('/login',function(req,res){
    res.set('Access-Control-Allow-Origin','http://localhost:3001')  //必须设置
    res.set('Access-Control-Allow-Methods','PUT') //必须设置
    res.set('Access-Control-Allow-Headers','test')
    res.set('Access-Control-Allow-Credentials', true)
    //如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。
    console.log('xxxxx')
    res.send('optins')
  })  

  app.put('/login', (req, res) => { 
    res.set('Content-Type', 'application/json')
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001')
    // res.set('Access-Control-Max-Age', '86400')
    res.set('Access-Control-Allow-Credentials', true)

    console.log('in login')
    res.send('ccccc')
  })
```

服务端必须设置 Access-Control-Allow-Credentials 的响应头 为 true。同时 Access-Control-Allow-Origin 必须设置为指定域。不能为 *。

## 总结

想比较 JSONP 来说，cors 跨域支持所有的 http 方法，JSONP 只支持 get 请求，但是 JSONP 的兼容性比较好，支持几乎所有的浏览器，cors 不支持 IE10 以下的浏览器。