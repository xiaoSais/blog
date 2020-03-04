# 二、axios实例

文件路径 index -> lib/axios

引用外部模块：

<a href="./tools.html">1、util工具类</a>

<a href="./config.html">2、默认参数配置</a>

<a href="./Axios.html">3、Axios 核心类</a>

<a href="./mergeConfig.html">4、选项合并</a>

### 导出
官方的使用方式:
```
  import axios from 'axios'
  axios({
    method:'get',
    url:'http://bit.ly/2mTM3nY',
    responseType:'stream'
  }).then(function(response) {
    response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
  });
```
猜想源码应该导出了一个 axios 实例, 且该实例本身可以是一个函数可以传入配置项。

该文件 line 50 - 53 证实了我们的猜想：
```
  module.exports = axios;
``` 

### 创建 axios 实例

axios实例 由 createInstance 方法（line 15 - 26）创建，该方法主要做了以下几件事：
```
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
  }
```
* 根据默认参数配置（看资料1）通过 Axios 函数创建 axios 上下文（line 16），参数引于default.js 文件。
```
  var context = new Axios(defaultConfig);
```
* 创建 axios 实例，该实例也是一个方法，即 Axios.prototype.request，同时该方法 this 绑定到 context，这也是我们可以使用 axios(config) 的原因。（line 17）

```
  var instance = bind(Axios.prototype.request, context);
```
* 继承 Axios.prototype 和 context (line 20)
  
```
  utils.extend(instance, Axios.prototype, context);

  utils.extend(instance, context);
```

* 返回 instance

### axios.create(config)
该 api 可以创建 axios 实例，<a href="http://www.axios-js.com/zh-cn/docs/#axios-create-config">官方文档</a>。

该 api 内部将传入的配置对象与默认配置进行合并(看资料2)，并调用 createInstance 方法创建实例。

```
  axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
  };
```

### axios.spread(callback)

文档：处理并发请求的助手函数，<a href="http://www.axios-js.com/zh-cn/docs/#axios-spread-callback">并发文档</a>

引于/helpers/spread，作用是让函数接收数组形式的参数，实现原理是借用apply函数。

```
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }
```
eg: axios.spread(func)([2,3,4])

### axios.all(promise)

作用同 Promise.all(promise)也是用于处理并发的函数，line 45
```
axios.all = function all(promises) {
  return Promise.all(promises);
};
```
### axios.Axios
将Axios类挂载到 实例的Axios属性上

### 资料

<a href="./config.html">1、默认参数配置</a>

<a href="./mergeConfig.html">2、选项合并</a>
