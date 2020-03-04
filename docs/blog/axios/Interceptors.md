# 六、拦截器

相关文件路径 /lib/core/Axios.js && /lib/core/InterceptorManager.js

### 何为拦截器

拦截器（InterceptorManager）其实是一个中间件，axios 定义了两种 interceptor（axios.interceptors.request 和 axios.interceptors.response）在axios发起请求前或者请求后调用，用于变更 config |  response。

### 注册拦截器
1、eg: 使用 axios 正常发起发起请求：

```
  axios['get']('http://10.199.214.233:9876/vqp/config')
    .then(response => {
      console.log(response)
    }).catch(err => {
      console.log(err)
    })
```

打印出来的 response 除了接口返回的数据外，还有配置项等信息：
```
  {
    // 接口返回数据
    data: [],
    // 响应状态
    status: 200,
    // 响应状态描述
    statusText: 'ok',
    // 响应头
    headers: {
      content-length: "6502",
      content-type: "application/json; charset=utf-8"
    },
    // axios 配置信息
    config: {},
    // 响应对象
    request: {}
  }
```

2、eg: 使用 interceptor

```
  // 增加请求前的拦截器
  axios.interceptors.request.use(function (config) {
      // 发起请求之前改变 axios 配置，修改超时时间
      config.timeout = 200
      return config;
    }, function (error) {
      // 请求出错在这可以处理
      return Promise.reject(error);
    });
```

```
  // 增加响应后、返回前拦截器
  axios.interceptors.response.use(function (response) {
      // 处理响应数据，如果响应状态为200，只返回 response.data 和 response.config
      if (response.status === 200) {
        return {
          data: response.data,
          config: response.config
        }
      } else return 'error'
    }, function (error) {
      // 相应出错可以在这里处理
      return Promise.reject(error);
    });
```

打印出来的response为：

```
  {
    data: [],
    config: {
      ...,
      timeout: 200
    }
  }
```

axios对拦截器的处理顺序为：

```
  axios.interceptors.request => axios[method] =>  axios.interceptors.response
```
分别对应三个阶段：还未发起请求(interceptors.request[config]) => 发起请求并根据后端响应拿到Response => 处理请求（interceptors.response[Response]）=> 返回处理后的Response

### 注销拦截器

可以使用 axios.interceptors.request.eject(interceptor) | axios.interceptors.response.eject(interceptor) 来移除拦截器

eg:

```
  // 添加拦截器
  var interceptor = axios.interceptors.request.use(function (config) {
      // 发起请求之前改变 axios 配置，修改超时时间
      config.timeout = 200
      return config;
    }, function (error) {
      // 请求出错在这可以处理
      return Promise.reject(error);
    });
  // 发起请求，拦截器生效
  axios['get']('http://10.199.214.233:9876/vqp/config')
    .then(response => {
      // 200
      console.log(response.config.timeout)
    }).catch(err => {
      console.log(err)
    })
  
  // 注销拦截器
  axios.interceptors.request.eject(interceptor)
  // 发起请求，测试拦截器是否已经注销
  axios['get']('http://10.199.214.233:9876/vqp/config')
    .then(response => {
      // 0
      console.log(response.config.timeout)
    }).catch(err => {
      console.log(err)
    })
```

### axios 拦截器原理

文件路径： /lib/core/Axios.js

在 Axios 构造函数里创建了一个interceptors 对象。保存 Request 和 Response 的 interceptor 实例。这也是我们可以使用 axios.interceptors.request |  axios.interceptors.response 的原因。

line: 14 - 20
```
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
```

InterceptorManager 构造函数， 在文件 /lib/InterceptorManager.js 里定义，这个文件很短，只有52行：

#### 构造函数

InterceptorManager 构造函数为实例创建了一个   handlers 数组用于保存拦截器的处理函数。
```
  function InterceptorManager() {
    this.handlers = [];
  }
```

#### InterceptorManager.prototype.use(resolve, reject)

前面举例说了一下拦截器的使用方式，再贴一下：

```
  var interceptor = axios.interceptors.request.use(function (config) {
      // 发起请求之前改变 axios 配置，修改超时时间
      config.timeout = 200
      return config;
    }, function (error) {
      // 请求出错在这可以处理
      return Promise.reject(error);
    });
```

当调用 axios.interceptors.response.use 的时候，实际上就是调用的InterceptorManager.prototype.use 这个方法，这个方法返回拦截器的Id，以便于有需要的话注销该拦截器。

line: 17 - 23
```
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };
```
调用 use 的时候，往 handles 数组里 push 一个对象，该对象的两个属性分别对应 Promise.then 和 Primise.reject 需要处理的函数，也就是调用的时候传的两个参数。

#### InterceptorManager.prototype.eject(id)

注销拦截器即调用该函数，将对应Id的拦截器对象置位 null。

```
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
```
id 即为use的时候返回的拦截器的idx。

#### InterceptorManager.prototype.forEach(fn(interceptor))

该方法用于遍历拦截器，interceptor 即为 handles 里的每一个元素，同时该函数会跳过为 null 的元素。

```
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };
```
给 util.forEach 封装了一层。

#### 调用

上面分析完了 interceptor 类的所有方法，来看看在Axios内部是如何处理的，文件同样是 /lib/core/Axios.js。

line: 50 - 51

```
  Axios.prototype.request = function request(config) {

    ...
    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
  }
```
1、request 函数在内部创建名为 chain 队列，该队列保存所有需要执行的 Promise 方法。初始化两个元素 dispatchRequest和 undefined，dispatchRequest 为真正处理 axios[method]成功的promise，undefined是为了处理失败时候情况。

```
  var chain = [dispatchRequest, undefined];
```

2、创建一个基于 axios.config 的 promise 对象。

```
  var promise = Promise.resolve(config);
```

3、上文提到当我们使用对应的 interceptor.use 的时候，会向 handles 放入对应的处理函数。在执行axios[method]方法时，会遍历handles，针对两种拦截器（request | response）会分别在 chain 的队头 | 队尾添加这些处理函数，一次会同时添加两个处理函数，即成功时的和失败时的。如果设置拦截器的话 chain 队列会变成这样：

```
  [requestResolve,  requestReject, dispatchRequest, undefined, responseREsolve, responseReject]
```
4、依次拿出队头元素作为 promise.then() 对象的参数，直到队列为空。

```
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
```
因为 promise 是基于 axios.config 创建，所以在执行 requestResolve 的时候拿到的参数就是 axios.config。promise.then() 方法由于返回的是新promise，所以这边要将 promise 重新赋值，用于将上一步的结果传递给下一个promise。