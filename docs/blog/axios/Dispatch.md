# 七、请求分发 && 适配器

在<a href="/Interceptors.html">拦截器</a>一文中提到，我们使用对应的 interceptor.use 的时候，会向 handles 放入对应的处理函数，针对两种拦截器会分别在 chain 的队头和队尾添加这些处理函数，当设置拦截器时，chain 队列会变成这样：

```
  [requestResolve,  requestReject, dispatchRequest, undefined, responseResolve, responseReject]
```
如果没有设置拦截器 chain 队列就是默认值即: [dispatchRequest, undefined]，dispatchRequest 即为调用 axios[method] 时真正的处理函数。然后基于 axios.config 创建promise实例，循环 chain 队列，依次调用这些处理函数。

由于 promise 是基于 axios.config 创建的，所以在 promise.then() 里执行的 dispatchRequest 入参应该也是 axios.config。

### dispatch

文件路径：/lib/core/dispatchRequest.js

dispatchRequest 方法的定义在 line 23 - 79，该方法的传参正如我们所想就是 axios.config，返回一个Promise。

line 24 - line 41:
```
  module.exports = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData(
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );
    ....
  }
```
1、throwIfCancellationRequested(config) 函数用来取消请求的 cancel token。

2、确保 config.headers 存在，因为下一步会用到 config.headers 

3、根据配置项的 config.transformRequest 来转化请求数据。
文档上的该配置项的使用方法为：
```
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],
```
transformRequest 的传参是一个数组，可以传入多个函数依次调用，返回的 data 为最后一次调用的处理函数的结果。

在 axios 里它的实现方式为：

文件路径：/lib/core/transformData.js
```
  module.exports = function transformData(data, headers, fns) {
    /*eslint no-param-reassign:0*/
    utils.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });

    return data;
  };
```
通过 util.forEach() 方法遍历 transformData 方法传入的第三个参数fns，在这里fns 指的是 config.transformRequest，然后依次调用每一个fn，得到的结果（data） 传给下一个 fn。最后返回处理完成的 data。

4、扁平化 headers。

5、删除 config.headers[method] ??? 为啥要删除。

line 50 - line 78:

```
  module.exports = function dispatchRequest(config) {
    ...

    var adapter = config.adapter || defaults.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }
      return Promise.reject(reason);
    });
  }
```
这一部分主要是选择对应的 adapter(config | defaults.adapter)，执行 then()方法得到 Response，adapter 应该是一个 thenable 的对象。最后同样通过 config.transformResponse 去转化 response data。

### adaptper

在<a href="config.html">默认配置项</a>一文中，简单介绍了下默认的 adapter 配置：

> 该选项决定了 axios 根据何种方式处理 ajax 请求，它是可写的，允许用户自定义处理请求。默认情况下会检查当前环境，如果浏览器环境会引入 ./adapters/xhr 文件处理，如果为 node 环境会引入 ./adapter/http 文件处理。

#### adapter(xhr)

文件路径：/lib/adapters/xhr.js

由上文明显可以看到，adapter 的传参是 axios.config，config 在 dispatchRequest 函数里已经处理过。adapter 是个thenable 的函数，猜想 adapter 函数应该返回一个 Promise。

该路径下的文件是浏览器环境引入的，应该是调用的原生 XMLHttpRequest 对象处理 ajax 请求。

line 11 - 20：

```
  module.exports = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;

      if (utils.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();
      ...
  }
```
印证了我们的猜想，xhr adapter 返回了一个Promise，同时创建两个变量 requestData 和 requestHeaders，
判断 requestData 是否为 formData，是的话删除content-Type。与此同时还创建了 request 变量，一个XMLHttpRequest 实例。

line 23 - 33

```
  ...
  if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;
  ...
```
提供基本HTTP验证，如果配置中传入了 auth，会将相应的数据经过 btoa 编码写入到请求头里。然后调用 xhr.open(method, url) 初始化一个请求。第三个参数为 true 代表：

```
一个可选的布尔参数，默认为true，表示要不要异步执行操作。如果值为false，send()方法直到收到答复前不会返回。如果true，已完成事务的通知可供事件监听器使用。如果multipart属性为true则这个必须为true，否则将引发异常。
```
这个参数决定了 xhr 对象是否可以调用事件侦听器处理 xhr 不同阶段的数据。

line 105 - line 116 主要是设置 xsrfHeaders.

line 119 - line 128 给 request 对象挂载请求头。

```
  ...
  if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
  }
  ...
```

line 178, 发送请求。

```
  request.send(requestData);
```

line 36 - line 100, 主要是通过侦听器判断请求的状态进行不同的处理。

onreadystatechange readyState 发生改变的回调。下标列出了可能存在的值，需要注意的是为 4 的时候代表数据返回成功。
```
  0	UNSENT	代理被创建，但尚未调用 open() 方法。
  1	OPENED	open() 方法已经被调用。
  2	HEADERS_RECEIVED	send() 方法已经被调用，并且头部和状态已经可获得。
  3	LOADING	下载中； responseText 属性已经包含部分数据。
  4	DONE	下载操作已完成。
```

line 36 - line 65, 数据返回成功，封装返回数据。

```
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };
```

这段代码主要是监听 readyState 的值，如果为 4 的话，封装 response 的并返回，注意接口返回的值也是挂载到 request 对象上的。我们在 Interceptors 一章中举例说明了一下 axios 的返回数据结构，和这边定义的也是一致的，

line 68 - line 100，主要是处理 abort，error，timeout 的情况。这边不做深入分析。

#### adapter(http/https)

基于 http / https 的适配器，用于在非浏览器环境下发起请求。说一下核心思路吧。

#### 1、选择处理模块

axios 选项中定义了一个 transport 属性，允许你重写 axios 内部在非浏览器环境下的请求方式。但是在 axios 文档中并没有写。

https.js line 161 - line 172

```
  var transport;
  var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
  if (config.transport) {
    transport = config.transport;
  } else if (config.maxRedirects === 0) {
    transport = isHttpsProxy ? https : http;
  } else {
    if (config.maxRedirects) {
      options.maxRedirects = config.maxRedirects;
    }
    transport = isHttpsProxy ? httpsFollow : httpFollow;
  }
```

axios 会根据是否是 https 请求选用 https / http模块，同时如果选用了 maxRedirects 将会采用 follow-redirects 模块。

follow-redirects 是 http / https 的替代品，用于更好的处理重定向相关的请求。<a href="https://www.npmjs.com/package/follow-redirects">follow-redirects</a>

#### 2、处理请求

基于流的方式处理响应。

```
  var req = transport.request(options, function handleResponse(res) {
  if (req.aborted) return;

  // uncompress the response body transparently if required
  var stream = res;
  switch (res.headers['content-encoding']) {
  /*eslint default-case:0*/
  case 'gzip':
  case 'compress':
  case 'deflate':
    // add the unzipper to the body stream processing pipeline
    stream = (res.statusCode === 204) ? stream : stream.pipe(zlib.createUnzip());

    // remove the content-encoding in order to not confuse downstream operations
    delete res.headers['content-encoding'];
    break;
  }

  // return the last request in case of redirects
  var lastRequest = res.req || req;

  var response = {
    status: res.statusCode,
    statusText: res.statusMessage,
    headers: res.headers,
    config: config,
    request: lastRequest
  };

  if (config.responseType === 'stream') {
    response.data = stream;
    settle(resolve, reject, response);
  } else {
    var responseBuffer = [];
    stream.on('data', function handleStreamData(chunk) {
      responseBuffer.push(chunk);

      // make sure the content length is not over the maxContentLength if specified
      if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
        stream.destroy();
        reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
          config, null, lastRequest));
      }
    });

    stream.on('error', function handleStreamError(err) {
      if (req.aborted) return;
      reject(enhanceError(err, config, null, lastRequest));
    });

    stream.on('end', function handleStreamEnd() {
      var responseData = Buffer.concat(responseBuffer);
      if (config.responseType !== 'arraybuffer') {
        responseData = responseData.toString(config.responseEncoding);
      }

      response.data = responseData;
      settle(resolve, reject, response);
    });
  }
});
```
通过 http.request(options, func) 回调里拿到 res, res 是基于 stream 的，监听 res 的 data 事件，不断的拿到 chunk 放到 结果数组里。然后监听 end 事件，把结果数组转化一下再 resolve 出去。options 是通过传入的 config 拼装而成。 response 数据结构和 xhr 方式一致。以达到统一的效果。