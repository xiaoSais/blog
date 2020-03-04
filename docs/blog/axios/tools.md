# 一、工具类

文件路径 lib/util.js

### 数据类型判定

#### Object.prototype.toString

* array、arrayBuffer、file、blob、function、date

```
  // eg. 判断是否是 arrayBuffer 类型
  Object.prototype.toString.call(val) === '[object ArrayBuffer]'
```

#### typeof

* undefined、string、number、object
  
```
  // eg. 判断是否是 string 类型
  typeof val === 'string'
```

#### instanceof

URLSearchParams 是一个类，它的实例封装了一些处理查询字符串的实用方法，构造函数可以传一个字符串。

* formData、URLSearchParams

```
  // eg. 判断是否是 formData 类型
   (typeof FormData !== 'undefined') && (val instanceof FormData)
```

#### 其他

* buffer

  buffer 是 Node.js 中用于读取或者操作二进制数据量的类，其类上定义了 isBuffer() 方法判断该数据是否是 Buffer 的实例

  ```
    val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  ```

* axios适用的浏览器环境判断

  非 RN 环境，非原生环境，不能是 web-worker（ web-worker 无法使用 window 对象和 document 对象）

### 遍历

* forEach（obj, fn）

  适用于数组和对象，如果obj不是两者之一，则将其转化为 [obj] 的数组形式。如果是数组 / 对象，则遍历数组 / 对象，执行fn(item, index, obj) | fn(value, key, obj), 此时的 key 指的是自身属性，不是继承而来的。

  ```
  function forEach (obj, fn) {
    ...
    if (isArray(obj)) {
      // 也可以这样写
      // return obj.forEach(fn)
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  ```
  拓展了array.forEach的功能，使其应用于普通对象。

### 合并

* merge (obj1, obj2, obj3...)

  合并对象，相同的key，如果值为对象，后面的会和前面的值进行合并，类似于Object.assign(),该方法也适用于数组。

  ```
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
          result[key] = merge(result[key], val);
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
  }
  ```
* merge 和 Object.assign() 的区别
  
  merge 遇到相同属性的时候，如果属性值为纯对象或者集合时，不是用后面的属性去覆盖前面的属性值，而是会把前后两个属性值合并。

  ```
    // { a: 1, b: { e: 4 } }
    Object.assign(
      {},
      { a: 1 },
      { b: { c: 2, d: 3} },
      { b: { e: 4 } }
    )
    // { a: 1, b: { c: 2, d: 3, e: 4 } }
    merge({},
      { a: 1 },
      { b: { c: 2, d: 3} },
      { b: { e: 4 } }
    )
  ```


* deepMerge (obj1, obj2, obj3)

  该方法类似于 Merge，唯一区别是返回的新对象不会影响到传入的参数对象。

### 继承

* extend(a, b, thisArg)
  
  遍历 b 的 key，如果该 key 的值为function，将 this 绑定到 thisArg 上并赋值给 a，否则将 a[key] 置为 b[key]，最后返回a。

  ```
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof v al === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }
  ```