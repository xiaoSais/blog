# 十、代码之如何实现？

## 1、如何实现数组的扁平化？

什么是数组扁平化？

假如说一个数组是这样的。

```
  let arr = [1,2,3,4,[4,5], [3,4,[4,5]]]
```
也就是数组里面嵌套数组，可能有很多层。

数组扁平化的意思就是将该数组转化成：

```
  let brr = [1,2,3,4,4,5,3,4,4,5]
```
当然，如果你实现的比较好的话，可以传一个扁平化深度的这样一个参数。

扁平化一层就是：
```
  let crr = [1,2,3,4,4,5,3,4,[4,5]]
```
扁平化两层就是 brr 那种形式了。一般默认情况下说数组扁平化就是指完全扁平化。也就是无论嵌套层数多深，都拉平成一维数组。

### ES6 实现

ES6 提供了一个新的 api。Arry.prototype.flat() 用于数组的扁平化，可以传一个参数，指的是拉平多少层。如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。 

```
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

```
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
```
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
```
  const flat = arr => arr.reduce((prev, next) => {
    return Array.isArray(next) ? prev.concat(flat(next)) : prev.concat(next)
  }, [])
  // [1,2,3,4,4,5,3,4,4,5]
  console.log(flat([1,2,3,4,[4,5], [3,4,[4,5]]]))
```

## 2、如何实现数组的随机排序？

### 使用 array.sort() 方法

sort() 方法会对比相邻元素的大小，这里用了 Math.random() 方法，随机置换相邻元素的位置。
```
  function randomSort(arr) {
    arr.sort(() => Math.random() > .5 ? 1 : -1)
    return arr
  }
```
因为这是对比相邻元素的大小，所以还不够随机。

### 随机索引

不断去随机删除 arr 里面的元素，并添加到结果数组里，直到数组的长度为 0。

```
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

```
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

```
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

```
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

```
  function CreateObjProto () {}
  CreateObjProto.prototype.name = 'yy'
  CreateObjProto.prototype.age = '23'
  CreateObjProto.prototype.getName = function () { alert(this.name) }
```

更简洁的原型语法
```
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

```
  function CreateObj (name, age) {
    this.name = name
    this.age = age
  }
  CreateObj.prototype.getName = function () { alert(this.name) }
```

### 动态原型模式

主要是为了解决组合模式看起来不够封装的写法。
```
  function CreateObj (name, age) {
    this.name = name
    this.age = age
    if (typeof CreateObj.prototype.getName !== 'function') {
      CreateObj.prototype.getName = function () { alert(this.name)  }
    }
  } 
```

### 委托构造模式

封装私有方法。

```
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

