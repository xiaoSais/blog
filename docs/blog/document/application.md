# 十、代码之如何实现？

## 1、如何实现数组的扁平化

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

## 2、如何实现数组的随机排序

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