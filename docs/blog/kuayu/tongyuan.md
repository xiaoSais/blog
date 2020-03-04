# 同源策略

所谓同源就是 协议、ip/host、端口三者都一致。由于浏览器的同源策略限制，不同源脚本不能共享cookie、不能互相操作 dom ，也不能发起 ajax 请求。

## ajax 请求

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
## DOM 无法共享

如果两个网页不同源就拿不到对方的DOM。

eg: 页面1 http://localhost:3000/index.html

```
  <html>
  <head>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>
  <body>
      <div>parent page</div>
      <div>
        <iframe src="http://localhost:3001/index.html" id="child"></iframe>
      </div>
  </body>
  <script>
    console.log(document.getElementById('child').contentWindow)
  </script>
</html>
```

嵌套了一个域为 http://localhost:3001/index.html 的iframw，试图在页面1 获得iframe 的DOM

控制台打印：
```
document: [Exception: DOMException: Blocked a frame with origin "http://localhost:3000" from accessing a cross-origin frame. at invokeGetter (<anonymous>:1:142)]
```

## Cookie 无法共享

父页面：
```
  <html>
    <head>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    </head>
    <body>
        <div>parent page</div>
        <div>
          <iframe src="http://localhost:3001/index.html" id="child"></iframe>
        </div>
    </body>
    <script>
      console.log(document.cookie)
      document.getElementById('child').onload = function () {
        console.log( this.contentWindow.document.cookie )
      }
    </script>
  </html>
```
浏览器控制台报错：
```
  Uncaught DOMException: Blocked a frame with origin "http://localhost:3000" from accessing a cross-origin frame.
    at HTMLIFrameElement.document.getElementById.onload (http://localhost:3000/index.html:14:39)
```