# 六、关于this
今天重温了《你不知道的JavaScript》一书，特别是关于this这章，受益匪浅，特此记录总结一下。
## 总结

>this 实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

这句话在第一卷81页，也是关于this指向的精髓。它的意思是要知道this指向的谁，要分析函数的调用位置，本质上函数的调用是一个不断堆栈的过程，也就是要分析好函数的调用栈。

## this的四种绑定方式
### 默认绑定
调用函数的时候不加任何修饰,此时只能应用默认绑定规则。默认规则下this指向全局变量。
```
function foo() { 
    console.log(this.a);
}
var a = 2; 
foo(); // 2
```
调用foo方法的时，不加任何修饰此时this应用默认绑定规则，this.a也就是window.a。
### 隐式绑定
调用函数时，要考虑调用位置是否有上下文对象，如果有的话this指向的就是该上下文对象。
```
function foo() { 
    console.log(this.a);
}
var obj = { a: 2, foo: foo };
obj.foo(); // 2
```
foo函数被调用时，调用的位置有obj对象，this被绑定在这个obj对象上。
```

function foo() { 
    console.log(this.a);
}
var obj2 = { a: 42, foo: foo };
var obj1 = { a: 2, obj2: obj2 };
obj1.obj2.foo(); // 42
```
对象属性引用链中只有最顶层或者说最后一层会影响调用位置，所以在该例子中this只能被绑定在最顶层的obj2对象上。

#### 隐式丢失
```
function foo() { 
    console.log(this.a);
}
var obj = { a: 2, foo: foo };
var bar = obj.foo; // 函数别名!
var a = "oops, global"; // a 是全局对象的属性 
bar(); // "oops, global" 
```
在这个例子中obj.foo被赋值给bar，bar实际上指向的是foo这里调用bar()也就是相当于直接调用了foo()，此时没有任何修饰符修饰，this应用默认绑定规则。对象的复制只是复制了一份引用。
```
function foo() { 
    console.log(this.a);
}
function doFoo(fn) {
    // fn 其实引用的是 foo 
    fn(); // <-- 调用位置!
}
var obj = { a: 2, foo: foo };
var a = "oops, global"; // a 是全局对象的属性 
doFoo( obj.foo ); // "oops, global"
```
隐藏的引用类型的变量复制，存在于入参的时候，和上一个例子道理相同。

### 显示绑定
通过apply()和call()函数，强制指定this的绑定对象。
```
function foo() { 
    console.log(this.a);
}
var obj = { a:2 };
foo.call( obj ); // 2
```
在这个例子中，如果直接执行foo()，this执行默认绑定规则，this.a也就是等于window.a。但是在调用foo()方法时，调用了call方法，强制改变this的指向，将this指向call中的参数obj，此时this.a就是代表了obj.a。

### new绑定
在使用new函数绑定的时候，this指向创建的对象。在使用new创建对象的时候，发生了以下几件事。
1. 创建(或者说构造)一个全新的对象。
2. 这个新对象会被执行[[原型]]连接。
3. 这个新对象会绑定到函数调用的this。
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。
```
function foo(a) { 
    this.a = a;
}
var bar = new foo(2); 
console.log( bar.a ); // 2
```
在这个例子中，this指向刚创建的对象bar，所以bar.a 为2。

## 优先级
1. 由new调用?绑定到新创建的对象。
2. 由call或者apply(或者bind)调用?绑定到指定的对象。
3. 由上下文对象调用?绑定到那个上下文对象。
4. 默认:在严格模式下绑定到undefined，否则绑定到全局对象。
## 例子

```
function foo(num) {
    console.log('foo  ' + num)
    this.count ++
}
foo.count = 0
var i
for(i =0; i<10; i++) {
    if(i > 5) {
        foo(i)
    }
}
//foo.count 0
//window.count NAN
```

一眼就看出来foo.count并不会变成4，因为在循环内调用foo(i)的是window对象，此时foo方法内this指向的是也是window对象，然而我还是太年轻，window.count 打印出来为NAN。<b>细思一下是因为window.count并没有初始化值，此时underfined执行++操作符就变成了NAN，如果初始化window.count = 0，运行完结果window.count = 4。</b>

```
function foo() { 
    console.log(this.a);
}
var a = 2; 
foo(); // 2
```
分析该函数的调用栈，调用foo()函数的位置是在window，所以this.a应该代表的是window.a

```
function foo() { 
    var a = 2;
    this.bar(); 
}
function bar() { 
    console.log(this.a);
}
foo(); // ReferenceError: a is not defined
```
这个例子我比较困惑，调用foo()函数的时候，调用位置是在window，所以this.bar()也就是调用window.bar()，事实情况下也是能够调用成功的，this.a报错，并且书上这么写：
>这段代码试图通过 this.bar() 来引用 bar() 函数。这是绝对不可能成功的。编写这段代码的开发者还试图使用 this 联通 foo() 和 bar() 的词法作用域，从而让 bar() 可以访问 foo() 作用域里的变量 a。这是不可能实现的，你不能使用 this 来引用一 个词法作用域内部的东西。

