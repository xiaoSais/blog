
# 一、构造函数

express是这样使用的:

```
  var express = require('express');
  var app = express();
```
构造函数源码在 lib/express.js 下:

```
  function createApplication() {
    var app = function(req, res, next) {
      app.handle(req, res, next);
    };

    mixin(app, EventEmitter.prototype, false);
    mixin(app, proto, false);

    // expose the prototype that will get set on requests
    app.request = Object.create(req, {
      app: { configurable: true, enumerable: true, writable: true, value: app }
    })

    // expose the prototype that will get set on responses
    app.response = Object.create(res, {
      app: { configurable: true, enumerable: true, writable: true, value: app }
    })

    app.init();
    return app;
  }

```
先看下 mixin 做了什么事情，mixin引入了外部的 merge-descriptors 库：
```
  var mixin = require('merge-descriptors');
```
merge-descriptors 的源码在index.js下，很短：

```
  function merge (dest, src, redefine) {
    if (!dest) {
      throw new TypeError('argument dest is required')
    }

    if (!src) {
      throw new TypeError('argument src is required')
    }

    if (redefine === undefined) {
      // Default to true
      redefine = true
    }
    // 获取源对象的所有属性名组成的数组，包括不可枚举属性
    Object.getOwnPropertyNames(src).forEach(function forEachOwnPropertyName (name) {
      // 如果目标对象有该属性并且 redefine 标志为false那么跳过该属性，不覆盖
      if (!redefine && hasOwnProperty.call(dest, name)) {
        // Skip descriptor
        return
      }

      // 将 src 对象复制到 dest 上，包括属性描述符
      var descriptor = Object.getOwnPropertyDescriptor(src, name)
      Object.defineProperty(dest, name, descriptor)
    })

    return dest
  }
```
该函数接受三个参数，dest：目标对象，src：源对象，redefine： 是否覆盖目标对象的属性

简单来说mixin(A,B)方法做了一个浅拷贝，将B的属性和值复制到A上。

```
  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);
```
这两句的意思就很明显了，这里使用 EventEmitter.prototype、 proto 和初始化app实例，其实也可以说是app实例继承了 EventEmitter 和 proto。

EventEmitter 是Node.js event包里的一个类，所有能触发事件的对象都是EventEmitter 类的实例。mixin之后，app应该有了EventEmitter类的所有方法，比如on()监听事件，emit()触发事件。

proto 是Express的实例核心，在 lib/application.js 下。

```
  app.request = Object.create(req, {
      app: { configurable: true, enumerable: true, writable: true, value: app }
    })

  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })
```
这两句在app实例上挂载了request和response属性，他们分别指向了req和res对象，他们引自 lib/request.js 和 /lib/response.js，目的未知。

然后执行app.init()方法，猜想该方法应该是在 application.js 里定义的。

```
  exports.json = bodyParser.json
  exports.query = require('./middleware/query');
  exports.raw = bodyParser.raw
  exports.static = require('serve-static');
  exports.text = bodyParser.text
  exports.urlencoded = bodyParser.urlencoded
```
在 express.js 的最后暴露出一些内置中间件，可以通过express.xxx()类似这种方式调用，在express 4.x文档里只有这四种内置中间件，其他定义的中间件也是可以使用的。
```
  express.json()
  express.static()
  express.Router()
  express.urlcoded()
``` 
下边逐一说明express内置中间件的实现方式。

