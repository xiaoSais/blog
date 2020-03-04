# 五、Axios 核心类

文件路径 /lib/core/Axios.js

### Axios 构造函数

在 <a href="./constructor.html">axios实例</a> 中，axios 上下文就通过该构造函数创建，axios 实例也是基于 Axios.prototype.request 的。

line 14:
```
  function Axios(instanceConfig) {
    // 默认配置选项
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
```
该函数给实例挂载了两个属性：axios.deafults 属性为 new Axios(opts) 传入的选项，也就是默认的参数配置。interceptors 为定义的内部拦截器。

### Axios.prototype.request(config)

axios 实例的雏形，主要做了以下几件事情：

* 参数处理，允许以 axios('/getList', config) 的格式发起请求：

  line 30
  ```
  // 如果第一个参数是字符串，那么配置项就在第二个参数，同时将 config.url 置为第一个参数，否则配置项就是第一个参数
  if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    } 
  ```
  line 40
  
  // 设置config.method，统一格式化为小写，如果默认配置和传入的 method 都为false的话这个值置位 'get'

  ```
    if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
    }
  ```

* 合并配置项
  
  将传入配置项和默认配置进行合并, this.defaults， 其实是 axios.defaults, 也就是在 defaults 文件中定义的。
  
  line: 37
  ```
    config = mergeConfig(this.defaults, config);
  ```

* 定义拦截器

  拦截器相关看这篇文章：<a href="Interceptors.html">Axios 拦截器</a>

* 返回 promise

  line: 64
  ```
    return promise
  ```
  该函数返回一个promise，这也是我们可以使用 axios[method].then() 的原因。

### Axios.prototype[method]

定义对应的 axios[method] 方法，分为两种需要 | 不需要合并data。

不需要合并 data 选项的 http 请求有：
  * delete、get、head、options

需要合并的有：
  *  post、put、patch

```
  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, data, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
});
```
内部还是调用了 Axios 原型链上的 Request 方法，并且 config 定义的 method、url、data 参数会被 axios[method] 方法传参所覆盖。