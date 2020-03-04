# 四、设计模式

## 继承

### mixin()
之前提到的 mixin() 方法位于 /lib/express.js。
line 41 - 42
```
  function createApplication() {
    ...
    mixin(app, EventEmitter.prototype, false);
    mixin(app, proto, false);
    ...
  }  
```
贴一下 mixin() 的实现：

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
该方法的原理是通过 Object.getOwnPropertyNames() 获取源对象的所有属性（枚举和不可枚举） 然后遍历获取每个属性的属性描述符，再用Object.defineProperty() 定义目标对象的属性。这样目标对象就继承了源对象所有的属性值和方法。

## 行为委托

### Object.create() 
/lib/express.js, line 45 - 47

```
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })
```
Object的作用是建立一个原型链,等效于 app.request.__proto__ = req

```
  var a = {}
  Object.defineProperty(a, 'ticj', {
    configurable: false,
    value: 23
  })
  Object.defineProperty(a, 'getName', {
    configurable: false,
    value: function (name) {
      this.name = name
    }
  })
  let d = Object.create(a)
  // {}
  console.log(d)
  // 23 实例中找不到去原型中找到
  console.log(d.ticj) 
  
  let c = Object.create(a, { gg: {
    configurable: false,
    value: 'test'
  }})
  console.log(c)
  // {gg: test}
```
d 本身没有'ticj'属性，但是 d.__proto__ 有该属性，Object.create()属性的第二个参数和Obeject.defineProperty()相同。

### setprototypeof()

```
  module.exports = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties)

  function setProtoOf (obj, proto) {
    obj.__proto__ = proto
    return obj
  }

  function mixinProperties (obj, proto) {
    for (var prop in proto) {
      if (!obj.hasOwnProperty(prop)) {
        obj[prop] = proto[prop]
      }
    }
    return obj
  }
```
两个方法，当前环境支持 __proto__，就用 setProtoOf，作用和 Object.create() 相同，否则用mixinProperties (), 该方法的不会覆盖目标对象的属性，并且取的是源对象的可枚举属性，这点和 mixin 稍微区分一下。