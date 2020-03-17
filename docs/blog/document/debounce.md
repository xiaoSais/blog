# 九、深入理解防抖和节流

## 防抖 （debounce）

  ::: tip
    在 N 秒后执行函数的回调，如果在这期间函数如果再次被调用，那么计时器将重新计时。
  ::: 

简单来说，就是在设定的时间内如果一直调用某个函数，该函数永远不会执行，除非函数调用间隔时间大于设定的时间。

一个场景，页面上有个 input 输入框，可以根据用户输入去拿远程数据用于快速搜索：

Js:

```
  function getData (value) { console.log(value) }
  let ip = document.getElementById('input')
  ip.addEventListener('keyup', (e) => {
    getData(e.target.value)
  }, false)
```

这里用 getData 模拟远程 ajax 操作。

用户每输入一次都要请求一次接口，会造成资源的浪费，理论上来说我们只要等到用户输入完成之后再请求是最好的。

但是我们也不知道用户输入到哪才算完成。

但我们可以设定一个时间间隔，如果相邻两次输入时间间隔小于某个值就不会发起请求。这样是不是就可以减少请求次数了呢。

### 延迟执行

延迟执行的意思是第一次调用不会执行，连续多次调用的话只执行最后一次。

首先为了实现以上功能，debounce 函数可以是一个功能性函数，类似于 bind。并且要传入一个待节流的函数和一个延迟时间，每次调用目标函数的时候会判断内部的定时器，如果存在的话就清除定时器并重新计时。

<b>延迟执行的 debounce 函数：</b>
```
  // fn，待处理函数，delay，等待时间
  function debounce (fn, delay) {
    let timer
    return function () {
      // 缓存 this && 参数
      let _this = this
      let args = arguments

      // 存在计时器，清除并重新计时
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => fn.apply(_this, args), delay)
    }
  }
```
使用方式：
```
  function getData (value) { console.log(value) }
  let ip = document.getElementById('input')
  let debounceData = debounce(getData, 3000)
  ip.addEventListener('keyup', (e) => {
    debounceData(e.target.value)
  }, false)
```
使用方式略微有点不同，利用 debounce 函数创建新的函数，该函数内部保存了 timer 的闭包。可以给这个新函数传参，该参数会被透传到目标函数。

延迟执行的小例子：

```
let print = debounce(console.log, 0)

print(1)
print(2)
print(3)
print(4)
````
因为是延迟执行，函数只会执行最后一次 4。

### 立即执行

如果我们希望用户第一次输入的时候就开始执行，连续多次调用的话只会执行第一次要如何做呢。

借助延迟执行的思路我们要多创建一个变量来判断本次是否可以执行。

<b>立即执行的 debounce 函数：</b>

```
  function debounce (fn, delay) {
    let timer
    return function () {
      let _this = this
      let args = arguments

      if (timer) clearTimeout(timer)

      // 如果 timer 不存在的话证明时间间隔已经超过可以执行
      callNow = !timer
      // delay 之后 timer 置为空
      timer = setTimeout(() => timer = null, delay)
      if (callNow) fn.apply(_this, args)
    }
  }
```

调用方式和延迟执行的函数调用一致。

立即执行的小例子：

```
let print = debounce(console.log, 0)

print(1)
print(2)
print(3)
print(4)
```

因为是延迟执行，所以函数只会执行第一次 1。

### 综合版本的防抖函数

如下，增加一个参数就行啦。

```
  /*
  * fn 目标函数
  * delay 间隔时间
  * immediate 是否立即执行
  */
  function debounce (fn, delay,immediate = false ) {
    let timer
    return function () {
      // 缓存 this 和传参，保持目标函数调用
      let _this = this
      let args = arguments

      // 如果间隔时间小于设定时间，重新计时
      if (timer) clearTimeout(timer)

      // 立即执行
      if (immediate) {
        let callNow = !timer
        
        timer = setTimeout(() => timer = null, delay)

        if (callNow) fn.apply(_this, args)
      } else {
        // 延迟执行
        timer = setTimeout(() => fn.apply(_this, args), delay)
      }
    }
  }
```




