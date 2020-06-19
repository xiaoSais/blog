# 十、代码之如何实现？

## 1、如何实现数组的扁平化？

什么是数组扁平化？

假如说一个数组是这样的。

```js
  let arr = [1,2,3,4,[4,5], [3,4,[4,5]]]
```
也就是数组里面嵌套数组，可能有很多层。

数组扁平化的意思就是将该数组转化成：

```js
  let brr = [1,2,3,4,4,5,3,4,4,5]
```
当然，如果你实现的比较好的话，可以传一个扁平化深度的这样一个参数。

扁平化一层就是：
```js
  let crr = [1,2,3,4,4,5,3,4,[4,5]]
```
扁平化两层就是 brr 那种形式了。一般默认情况下说数组扁平化就是指完全扁平化。也就是无论嵌套层数多深，都拉平成一维数组。

### ES6 实现

ES6 提供了一个新的 api。Arry.prototype.flat() 用于数组的扁平化，可以传一个参数，指的是拉平多少层。如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。 

```js
  function flat(arr, num = 1) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') throw new Error ('不是数组')
    else return arr.flat(num)
  }
  let arr = [1,2,3,4,[4,5], [3,4,[4,5]]]
  // [1,2,3,4,4,5,3,4,[4,5]]
  console.log(flat(arr))
  // [1,2,3,4,4,5,3,4,4,5]
  console.log(flat(arr, Infinity))
```

### 递归实现

使用递归判断否元素为数组，为数组的话递归拉平。

```js
  function flat(arr, res) {
    if (!Array.isArray(arr)) return
    else arr.forEach(i => Array.isArray(i) ? flat(i, res) : res.push(i))
    return res
  }
  // [1,2,3,4,4,5,3,4,4,5]
  console.log(flat([1,2,3,4,[4,5], [3,4,[4,5]]], []))
```

### 使用 ... 实现

用 ... 参数将数组一层层展开，直到原数组的每个元素都不为数组 
```js
  function flat (arr) {
    while(arr.some(i => Array.isArray(i))) {
      arr = [].concat(...arr)
    }
    return arr
  }
```
它会修改原数组

### 使用 reduce 实现

reduce 只是将写法简化了一点，本质上还是递归的写法
```js
  const flat = arr => arr.reduce((prev, next) => {
    return Array.isArray(next) ? prev.concat(flat(next)) : prev.concat(next)
  }, [])
  // [1,2,3,4,4,5,3,4,4,5]
  console.log(flat([1,2,3,4,[4,5], [3,4,[4,5]]]))
```

## 2、如何实现数组的随机排序？

### 使用 array.sort() 方法

sort() 方法会对比相邻元素的大小，这里用了 Math.random() 方法，随机置换相邻元素的位置。
```js
  function randomSort(arr) {
    arr.sort(() => Math.random() > .5 ? 1 : -1)
    return arr
  }
```
因为这是对比相邻元素的大小，所以还不够随机。

### 随机索引

不断去随机删除 arr 里面的元素，并添加到结果数组里，直到数组的长度为 0。

```js
  function randomSort(arr) {
    let res = []
    while(arr.length) {
      let idx = Math.floor(arr.length * Math.random())
      res.push(...arr.splice(idx, 1))
    }
    return res
  }
```

### 洗牌算法

针对数组中的每一个元素，该元素与之后的随机位置上的一个元素进行位置对换。

```js
  function randomSort (arr) {
    for (var i = 0; i < arr.length; i++) {
      let idx = Math.floor(Math.random() * (arr.length - i)) + i
      let temp = arr[i]
      arr[i] = arr[idx]
      arr[idx] = temp
    }
    return arr
  }
```

## 3、JS 如何创建一个对象？

这个创建对象不是创建 JS 的对象数据类型。而是创建实例的方式。

### 工厂模式

工厂模式就是类似于一个工厂一样，在方法内部创建一个对象，在该对象上定义属性和方法，缺点是无法通过 instanceof 判断该对象由哪个构造函数判断。

```js
  function createObj (name, age) {
    var obj = {}
    obj.name = name
    obj.age = age
    obj.getName = () => alert(obj.name)
    return obj
  }
  let person = createObj ('yy', 23)
  // yy
  console.log(person.name) 
  // false
  console.log(person instanceof createObj)
```

### 构造函数模式

和工厂模式差不多，不过无需内部创建一个对象。属性和方法定义在 this 上，创建对象时用 new 操作符创建。优点是可以通过 instanceof 操作符判断创建的对象所属的构造函数。缺点是构造函数定义的函数无法做到共用。每次创建一个对象都要在该对象上定义一个函数。

```js
  function CreateObj (name, age) {
    this.name = name
    this.age = age
    this.getName = function () {
      alert(this.name)
    }
  }
  let p = new CreateObj('yy', 23)
  // yy
  p.getName()
  // yy
  console.log(p.name)
  // 23
  console.log(p.age)
  // true
  console.log(p instanceof CreateObj)
```

### 原型模式

每个函数都有一个 .prototype 属性，它指该函数的原型，同时该原型对象有个 .constructor 属性指向该构造函数。该函数的实例有个 _proto_ 属性指向该原型对象。当获取某个对象的属性值的时候，先去实例上去找，找不到的话会去该原型对象上去寻找。缺点是所有的属性和方法都是共用的，无法实现对象的特殊化。

```js
  function CreateObjProto () {}
  CreateObjProto.prototype.name = 'yy'
  CreateObjProto.prototype.age = '23'
  CreateObjProto.prototype.getName = function () { alert(this.name) }
```

更简洁的原型语法
```js
  function CreateObjProto () {}
  CreateObjProto.prototype = {
    constructor: CreateObjProto,
    name: 'lucy',
    age: '23',
    getName: function () { alert(this.name) }
  }
```

### 组合模式

需要共享的属性定义在原型上，否则通过构造函数创建。

```js
  function CreateObj (name, age) {
    this.name = name
    this.age = age
  }
  CreateObj.prototype.getName = function () { alert(this.name) }
```

### 动态原型模式

主要是为了解决组合模式看起来不够封装的写法。
```js
  function CreateObj (name, age) {
    this.name = name
    this.age = age
    if (typeof CreateObj.prototype.getName !== 'function') {
      CreateObj.prototype.getName = function () { alert(this.name)  }
    }
  } 
```

### 稳妥构造模式

封装私有方法。

```js
  function CreateObj (name, age) {
    let obj = {}
    obj.age = age
    obj.getName = function () {
      alert(name)
    }
    return obj
  }
```
在这个方法中，只有内部的 getName 方法才能访问到传进来的 name 属性。


## 4、如何实现继承？

### 原型链继承

将子类的原型重写，指向父类的一个实例，那么子类的实例不仅拥有了在子类实例定义的方法和属性，还拥有了父类实例以及原型上的方法。通过这种方式实现了继承。

```js
  function Parent(name, age) {
    this.name = name
    this.age = age
  }
  Parent.prototype.getName = function () {
    return this.name
  }

  function Child(color) {
    this.color = color
  }
  Child.prototype = new Parent('lucy', 34)
  Child.prototype.getColor = function () {
    return this.color
  }
  let child = new Child('red')
  
  console.log(child)
  console.log(child.getName())
  console.log(child.getColor())
```

缺点：定义在父类原型上的引用类型的值，会被所有的子类实例所共有。改变其值会影响另外一个。

### 构造函数继承

借用 call 或者 apply，显式的绑定 this 指代的对象。以达到继承的效果。
```js
  function Parent(name) {
    this.name = name
    this.getName = function (params) {
      return this.name
    }
  }

  function Child(age, name) {
    this.age = age
    // 继承属性和方法
    Parent.call(this, name)
  }

  let Cl = new Child(23, 'Lucy')

  console.log(Cl)

  console.log(Cl.getName())
```

缺点：无法实现函数的复用，每次创建一个对象都要定义 getName 函数。

### 组合继承

将以上两者的优势结合起来，方法采用原型链继承，属性采用构造函数继承。

```js
  function Parent(color) {
    this.color = color
  }
  Parent.prototype.getColor = function () {
    return this.color
  }

  function Child(name, color) {
    this.name = name
    Parent.call(this, color)
  }

  Child.prototype = new Parent()

  Child.prototype.constructor = Child

  Child.prototype.getName = function (params) {
    return this.name
  }

  let C1 = new Child('Lucy', [2,3,4])
  let C2 = new Child('Lucy', [1,3,4])

  C1.color.push(5)

  console.log(C1.getColor())

  console.log(C1.getName())

  console.log(C2.getColor())

```

### 原型式继承

基于现有的对象创建一个类似的对象，无需大张旗鼓的创建构造函数。ES5 规范了 Object.create() 方法，它的工作原理就是创建一个类似对象，该对象的 __proto__ 指向传入的参数对象。一种写法见下面的 create() 方法。

```js
  let Parent = {
    name: 'Lucy',
    getName: function () {
      return this.name
    }
  }

  // Child.__proto__ = Parent
  let Child = Object.create(Parent)
  console.log(Child.getName())

  function create(Obj) {
    let f = new Function()
    f.prototype = Obj
    return new f()
  }
```
缺点：引用类型的值会被公用，修改值会影响创建的其他对象。

### 寄生式继承

类似于原型式继承，不过会增强该对象。新创建的对象不仅具有原来对象的属性和方法，还有新定义的 getName 方法。

```js
  function Child (parent) {
    let O = Object.create(parent)
    O.getName = function () {
      return this.name
    }
    return O
  }

  let cl = new Child({name: 'xxxxx' })

  console.log(cl.getName())
```

### 寄生组合式继承

原型链继承的时，摒弃将调用父类构造函数创建对象的方式，而是采用 Object.create() 的形式。
```js
  function Parent (name) {
    this.name = name
  }
  Parent.prototype.getName = function () {
    return this.name
  }

  function Child (age, name) {
    this.age = age
    // 继承属性
    Parent.call(this, name)
  }

  Child.prototype = Object.create(Parent.prototype)
  Child.prototype.constructor = Child

  Child.prototype.getAge = function () {
    return this.age
  }

  let cl = new Child(23, 'Lucy')

  console.log(cl.getName())
  console.log(cl.getAge())
```

优点是只需要调用一次构造函数，还能避免在子类原型上创建多余的其他属性和值。

## 5、如何写一个通用的事件侦听器?

首先要想一个事件侦听器都有神马？emmmmmmm，它应该具有以下功能：（1）事件监听 （2）事件移除（3）获取事件对象 （4）取消默认行为 （5）阻止冒泡

```js
  const Event = {
    // 添加事件
    addEvent: function (element, type, handler) {
      // ie, dom0, dom2级
      if (element.addEventListener) element.addEventListener(type, handler, false)
      else if (element.attachEvent) element.attachEvent(`on${type}`, handler)
      else element[`on${type}`] = handler
    },
    //移除事件
    removeEvent: function (element, type, handler) {
      if (element.removeEventListener) element.removeEventListener(type, handler, false)
      else if (element.detachEvent) element.detachEvent(`on${type}`, handler)
      else element[`on${type}`] = null
    },
    getTarget: (e) => e.target || e.srcElement,
    // 阻止默认事件
    preventDefault: function (e) {
      if (e.preventDefault) e.preventDefault()
      else e.returnValue = false
    },
    // 取消冒泡事件
    stopPropagation: function (e) {
      if (e.stopPropagation) e.stopPropagation()
      else e.cancelBubble = true
    }
  }
```

## 6、如何实现 instanceof

instanceof 的作用是识别某个实例是否属于某个构造函数，返回值是 true / false。

```js
  function myInstanceOf (obj, cons){
    while(obj) {
      let proto = Object.getPrototypeOf(obj)
      if (proto &&  proto === cons.prototype) return true
      else obj = proto
    }
    return false
  }
```

## 7、如何实现一个 new 操作符

new func() 的时候做了什么？

1、创建一个对象，this 指向该对象

2、如果函数返回的是非引用类型的数据结构，默认返回该对象，否则返回函数定义的返回值

3、执行原型链连接

4、执行该构造函数

```js
  function myNew () {
    let result = null,
        newObj = null,
        constructor = Array.prototype.shift.call(arguments)
    if (typeof constructor !== 'function') {
      console.error('type error')
      return
    }
    newObj = Object.create(constructor.prototype)
    result = constructor.call(newObj, ...arguments);
    if (result && (typeof result === 'object' || typeof result === 'function')) return result
    return newObj
  }

  console.log(myNew(Array, 8,7,8))

```

## 8、原生 Ajax 的实现

```js
  /**
  * 
  * @param {String} url 请求的url
  * @param {String} method 方法名
  * @param {Mixed} data post 传递的数据
  */
  function Ajax ( url, method='GET', data) {
    return new Promise((resolve, reject) => {
      
      // 创建 XMLHttpRequest 对象
      let xhr = new XMLHttpRequest()

      // 第三个参数代表是否发起异步请求
      xhr.open(method, url, true)

      // 监听 readyState的状态，如果是4的话，代表已经请求已经完成，接口返回的数据从实例的 response 属性拿到数据
      xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return
        if (this.status === 200) resolve(this.response)
        else reject(this.statusText)
      }
      xhr.onerror = function () {
        reject(this.statusText)
      }
      xhr.responseType = 'json'
      xhr.setRequestHeader('Accept', 'application/json')
      xhr.send(null)
    })
  }
```

## 9、如何实现防抖和节流？

<a href="./debounce.html#防抖-（debounce）">深入理解防抖和节流</a>

## 10、如何实现 apply 、call 以及 bind 函数？

apply、call、bind 函数能够被 函数直接调用，证明是定义在原型上的。原理是在绑定的对象上创建一个内部属性，该属性的值为调用的函数。最后再调用该函数，返回调用的结果，最后别忘了删除该属性。

<b>手动实现 call 函数</b>

```js
  Function.prototype.myCall = function () {
    // 如果调用者不是函数报错
    let _this = this
    if (typeof _this !== 'function') {
      throw new Error('Not function')
    }
    let obj = Array.prototype.shift.apply(arguments) || window

    // 保存结果
    let result = null
    
    // 创建内部变量
    obj._fn = _this

    // 执行函数，得到结果
    result = obj._fn(...arguments)

    // 删除中间属性
    delete obj._fn
    return result
  }
```
上面例子有个缺点，就是如果绑定的对象存在 _fn 属性，在执行完 call 之后，该属性会被删除。解决的方案是内部创建基于 symbol 的属性。

```js
  ...
  // 创建内部变量
  let fnKey = Symbol()
  obj[fnKey] = _this

  result = obj[fnKey](...arguments)

  delete obj[fnKey]

  ...
```

<b>手动实现 apply 函数</b>

和实现 call 函数方法一致，注意下传参。

```js
  Function.prototype.myApply = function () {
    let _this = this
    if (typeof _this !== 'function') {
      throw new Error('Not function')
    }
    let obj = [].shift.call(arguments) || window

    let result = null

    let fnKey = Symbol()

    obj[fnKey] = _this

    // myApply 最多只能传两个参数，这边先判断，如果传第二个参数调用待参数的方法，否则调用不带参数的
    result = arguments[0] ? obj[fnKey](...arguments[0]) : obj[fnKey]()
    
    delete obj[fnKey]
    return result
  }
```

<b>手动实现 bind 函数</b>

注意构造函数调用是绑定的对象

```js
  Function.prototype.myBind = function () {
    if (typeof this !== 'function') {
      throw new Error('Not function')
    }
    let _this = this
    let obj = [].shift.call(arguments)
    let args = [...arguments]
    return function Fn() {
      return _this.apply(this instanceof Fn ? this : obj, [...args, ...arguments])
    }
  }
```

## 11、如何实现函数的柯里化？

什么是函数的柯里化？

::: tip

```
  柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。
```
::: 
一个例子：

```js
  function add (a, b, c) {
    return a + b + c
  }
  let testCurry = curry(add)
  console.log(testCurry(1, 2, 3))
  console.log(testCurry(1, 2)(3))
  console.log(testCurry(1)(2)(3))
  // 以上🌰都能正确输出 6
```

实现思路：

闭包保存参数个数，当数量和函数的参数定义的参数数量一致时，执行函数

ES5 的写法：
```js
  function curry () {
    let fn = [].shift.call(arguments)
    let length = fn.length
    let args = [...arguments]

    return function () {
      let arg = args.slice(0)
      
      for (let i = 0; i < arguments.length; i++) {
        arg.push(arguments[i])
      }

      if (arg.length >= length) {
        return fn.apply(this, arg)
      } else return curry.call(this, fn, ...arg)
    }
  }
```

ES6 的写法

```js
  function curry (fn, ...args) {
    return fn.length <= args.length ? fn(...args) : curry.bild(null, fn, ...args)
  }
```
