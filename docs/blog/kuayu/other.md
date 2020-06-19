# 其他跨域策略

## 共享 Cookie

不同域的两个页面不能共享 Cookie, 但是如果两个页面一级域名相同，只是二级域名不同，浏览器可以通过设置 document.domain 共享 cookie。

eg: A 网页是 http://a.example.com/a.html, B 网页是 http://b.example.com/b.html, 那么只要设置相同的 document.domian, 两个网页就可以共享Cookie。

```js
  document.domain = 'example.com'
```

现在，A网页通过脚本设置一个 Cookie。

```js
  document.cookie = "test1=hello"
```
B网页就可以读到这个 Cookie。

```js
  var allCookie = document.cookie;
```

## Iframe 跨域

如果两个网页不同源就拿不到对方的DOM。

eg: 页面1 http://localhost:3000/index.html

```html
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
```bash
document: [Exception: DOMException: Blocked a frame with origin "http://localhost:3000" from accessing a cross-origin frame. at invokeGetter (<anonymous>:1:142)]
```

### 片段标识符跨域

父子页面通信可以通过改变对方页面路径的 hash 值，然后通过监听对应页面的hashchange 事件获得传过来的数据。

父页面向子页面传递数据：

Parent:
```js
  let child = document.getElementById('child')
  child.onload = function () {
    // 增加页面的 hash 值
    this.src = 'http://localhost:3001/index.html#fromParent'
  }
```

Child: 
```js
  window.onhashchange = function () {
    // #fromParent
    console.log(location.hash)
  }
```

子页面向父级页面传递数据:

Child: 
```js
  window.parent.location.href = 'http://localhost:3000/index.html' + '#' + 'fromChild'
```

Parent:
```js
  window.onhashchange = function () {
    // #fromChild
    console.log(location.hash)
  }
```

### window.name 跨域

子页面将数据保存到 window.name, 然后 改变 location 为父页面同源的一个页面，父页面就可以通过获取子页面的 name 拿到该值。

Child:
```js
  window.name = 'fromChild'
  location = 'http://localhost:3000/index.html'
```

Parent:

```js
  child.onload = function () {
    console.log(this.contentWindow.name)
  }
```

### postMessage 跨域

父页面向子页面传递信息,子页面拿到信息后又向父级页面传递信息。

Parent:

```js
  child.onload = function () {
    // 第一个参数为传递的数据，第二个参数为你要发送的源。子页面的源。
    this.contentWindow.postMessage('form parent', 'http://localhost:3001')
  }
  window.addEventListener('message', (e) => {
    // http://localhost:3001
    console.log(e.origin)
    // 'from child'
    console.log(e.data)
  })
```
Child:
```js
  window.addEventListener('message', (e) => {
    // 调用 postMessage 的窗体的源, http://localhost:3000
    console.log(e.origin)
    // 调用 postMessage 的 window 对象
    console.log(e.source)
    // 传过来的数据, form parent
    console.log(e.data)
    e.source.postMessage('from child', 'http://localhost:3000')
  })
```