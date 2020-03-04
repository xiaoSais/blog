# 深入理解 Jsonp

Jsonp 是一种跨域的手段。

因为浏览器的同源策略，不同源脚本不能共享cookie、不能互相操作 dom ，也不能发起 ajax 请求。

## 同源策略

1、页面所在的服务1(端口3001):

Server:
```
  const express = require('express')
  const app = express()
  const port = 3001
  app.use(express.static('public'))

  app.get('/data', (req, res) => res.send('Hello World!'))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

Page:

```
  <html>
    <body>
      <div>page</div>
    </body>
  </html>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></>

  <script>
    axios.get('http://localhost:3000/data', {
      firstName: 'lucy',
      lastName: 'hii'
    }).then(res => {
      console.log(res.data)
    })
  </script>

```
2、接口所在的服务2（端口3000）

Server:
```
  const express = require('express')
  const app = express()
  const port = 3000

  app.get('/data', (req, res) => res.send('Hello World!'))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

3001 端口的页面试图访问 3000 端口的接口浏览器报错。

```
(index):1 Access to XMLHttpRequest at 'http://localhost:3000/data' from origin 'http://localhost:3001' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Jsonp 跨域

Jsonp 利用了通过 scrip 标签请求 Js 文件没有同源策略限制的特性。

我们项目中为了增加 Js 的加载速度用了各种 CDN，这些 CDN的域和项目本身所在的域大多不同，也是利用了这一特性。

打开 www.baidu.com 首页的开发者模式：

```
<script src="https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/js/min_super-224c7a98dc.js"></script>

```
<b>百度首页也干了！</b>

### 如何实现 Jsonp 跨域

你想啊，我们发起 Jsonp 请求，比如我想发请求 1，是不是要在代码里写：

```
  <script src="https://otherDomain/1"></script>
```

那我想发请求 2呢，是不是要在代码里写好：
```
  <script src="https://otherDomain/2"></script>
```

好，那现在有个场景是在文章列表根据文章 id 去拿文章详情，这个id是动态的要怎么办呢？

很明显不能在代码里写死了，但我们可以动态创建 script 标签啊：

Client.js
```
  function sendJsonpRequest(callbackName, url, params) {
    let jsonpDom = document.querySelector('#jsonp')
    if (jsonpDom) document.querySelector('body').removeChild(jsonpDom)
    const s = document.createElement('script')
    const param = qs.stringify(Object.assign({ callback: callbackName }, params))
    s.src = `${url}?${param}`
    s.id = 'jsonp'
    document.querySelector('body').appendChild(s)
  }
```

我们的 sendJsonpRequest() 方法可以动态的传 params 并创建 script 标签，src 属性指向我们拼接的url。qs.stringify 方法主要是将 js 对象转化成 key = value 的字符串形式。为了避免发起很多请求时创建过多无效的标签，我们发请求时先把以前创建的节点清除掉。

那我们假设成功发起请求了，我们要怎么拿到后端传的数据呢。

我们想到在请求Js的时候，<b>Js会立刻下载并执行</b>。 那么后端只需返回携带数据的Js代码就可以了，前端会立刻执行这段代码。

所以后端完全可以返回一个方法的调用，这个方法传参就是返回的数据，同时在客户端有该回调函数的定义。

Client.js
```
  // 拿到数据的回调
  function getArticleData (data) {
    console.log(data.id)
    // 执行其他业务逻辑
  }

  // 发起请求
  sendJsonpRequest('getArticleData', 'http://localhost:3000/login', {id: 2})
```

同时后端可以通过 sendJsonpRequest 方法知道需要返回的函数名。

Server

```
const express = require('express')
const app = express()
const port = 3000

app.get('/login', (req, res) => { 
  res.set('Content-Type', 'text/javascript')
  console.log(req.query)
  // 根据不同的 id 返回不同的数据
  let data
  switch ( req.query.id ) {
    case '2':
      data = {name: 'lucy', age: 23, id: 2}
      break;
    case  '1':
      data = {name: 'peter', age: 34, id: 1}
      break
  }
  res.send(`${req.query.callback}(${JSON.stringify(data)})`) 
})
```

比如上面那个例子，后端返回的是：

```
  getArticleData({"name":"peter","age":34,"id":2})
```
后端拿到 id 或者 callback 函数名可以执行不同的操作逻辑，最后组合成函数调用返回给前端。前端执行这段逻辑就能拿到数据啦。

没错，JsonP 就是这么简单！

### 附录

完整的代码示例

Client.js

```
  <html>
  <body>
    <div>page</div>
  </body>

</html>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>

<script>
  
  function getArticleData(data) {
    console.log(data.name)
  }
  const qs = {
    stringify: function (obj) {
      if (typeof obj !== 'object') throw new Error('not obj')
      else return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')
    }
  }
  function sendJsonpRequest(callbackName, url, params) {
    let jsonpDom = document.querySelector('#jsonp')
    if (jsonpDom) document.querySelector('body').removeChild(jsonpDom)
    const s = document.createElement('script')
    const param = qs.stringify(Object.assign({ callback: callbackName }, params))
    s.src = `${url}?${param}`
    s.id = 'jsonp'
    document.querySelector('body').appendChild(s)
  }
  sendJsonpRequest('getArticleData', 'http://localhost:3000/login', {id: 2})
</script>
```

Server.js

```

const express = require('express')
const app = express()
const port = 3000

app.get('/login', (req, res) => { 
  res.set('Content-Type', 'text/javascript')
  console.log(req.query)
  // 根据不用的callback 传递不同的数据
  let data
  switch ( req.query.id ) {
    case '1':
      data = {name: 'lucy', age: 23, id: 1}
      break;
    case  '2':
      data = {name: 'peter', age: 34, id: 2}
      break
  }
  res.send(`${req.query.callback}(${JSON.stringify(data)})`) 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```


### 总结

1、JSONP的优点是：它不像XMLHttpRequest对象实现的Ajax请求那样受到同源策略的限制；它的兼容性更好，在更加古老的浏览器中都 可以运行，不需要XMLHttpRequest或ActiveX的支持；并且在请求完毕后可以通过调用callback的方式回传结果。

2、JSONP的缺点则是：它只支持GET请求而不支持POST等其它类型的HTTP请求；它只支持跨域HTTP请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript调用的问题。

3、JSONP的最基本的原理是：动态添加一个标签，而script标签的src属性是没有跨域的限制的。这样说来，这种跨域方式其实与ajax XmlHttpRequest协议无关了。
jsonp的本质是：动态创建script标签，然后通过他的src属性发送跨域请求，不同意然后服务器相应的数据格式为【函数调用foo（实参）】，所以在发送请求之前必须声明一个函数，并且函数的名字与参数中传递的名字要一致。

可以说jsonp的方式原理上和是一致的，因为他的原理实际上就是 使用js的script标签 进行传参，那么必然是get方式的了，和浏览器中敲入一个url一样

原理就是从服务端加载一段脚本（用script标签），然后把数据放到一个函数参数里面，再然后浏览器里定义的那个函数就能拿到那个数据了~所以为啥不能发post 因为标签里只能发get，虽然， jsonp 的实现跟 ajax 没有半毛钱关系，jsonp是通过 script的src实现的，但是最终目的都是向服务器请求数据然后回调，而且为了方便，所以jquery把 jsonp 也封装在了 $.ajax 方法中，调用方式与 ajax 调用方式略有区别。
