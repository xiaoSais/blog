# 三、默认配置项

文件路径 default.js

该文件导出defalut对象，该对象主要包括以下内容：

### adapter

该选项决定了 axios 根据何种方式处理 ajax 请求，它是可写的，允许用户自定义处理请求。默认情况下会检查当前环境，如果浏览器环境会引入 ./adapters/xhr 文件处理，如果为 node 环境会引入 ./adapter/http 文件处理。（line 16 - 26）

```
  function getDefaultAdapter() {
    var adapter;
    // 判断 XMLHttpRequest 对象是否存在
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = require('./adapters/xhr');
    } else if (typeof process !== 'undefined' && 
    // node 环境判断process全局变量
    Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = require('./adapters/http');
    }
    return adapter;
  }
```

### transformRequest

该选项的默认值是一个数组，数组只有一个 transformRequest(data, headers) 函数，该函数对不同的 Request data 执行相应的数据转换处理，同时设置对应的 Content-type，最后返回转化后的 data。它也是可写的，允许用户在发送请求数据前修改请求数据。

data 主要有以下几种类型：

* formData | blob | file | stream | buffer | arrayBuffer (不做任何转化处理，直接返回data)

* arrayBufferView (返回data.buffer)

* URLSearchParams (返回 data.toString, 设置请求头 ContentType 为 application/x-www-form-urlencoded;charset=utf-8)

* object (返回JSON.stringfy(data)), 设置请求头 ContentType 为 application/json;charset=utf-8

### transformResponse

同 transformRequest，它针对的是返回的数据，同时也支持用户自定义。

### timeout 

超时时间，以毫秒为单位，默认为0

### xsrfCookieName

用作 xsrf token 的值的cookie的名称，默认为 'XSRF-TOKEN'

### xsrfHeaderName

用作 xsrf token 的值的Header的名称，默认为 'X-XSRF-TOKEN'

### maxContentLength

定义允许的响应内容的最大尺寸, 默认为 -1

### validateStatus

验证响应状态，status 在200-300之间返回 true

### headers

#### common 

```
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
```
#### delete | get | head

```
  [methods]: {}
```
#### post | put | patch
```
  [methods]: { 'Content-Type': 'application/x-www-form-urlencoded' }
```   