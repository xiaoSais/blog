# 二、你真的了解无限加载组件吗？

## 总结
vue-infinite-loading（推荐使用） > vue-infinite-scroll > vue-scroller

## vue-scroller
### 安装
```
npm i vue-scroller -S
```
### 使用
scroller标签包裹下拉刷新，上拉加载元素。onfinite绑定上拉加载时的回调，onrefresh绑定下拉刷新时候的回调。
```
//main.js 
import VueScroller from 'vue-scroller';
Vue.use(VueScroller);
 
//app.vue
<scroller :on-infinite="loading" ::on-refresh="refresh">
    <div class="block" v-for="(item,index) in 20" :key="index">{{index}}</div>
</scroller>
```

### 问题
scroller标签包裹下拉刷新，上拉加载元素。onfinite绑定上拉加载时的回调，onrefresh绑定下拉刷新时候的回调。

* 该组件周围的div元素都会被scroller容器覆盖到，要想显示出该元素必须修改* scroller元素的距离顶部的位置。
* 包裹元素在容器内可以上下滑动，即使没有下拉刷新回调也可以下拉。
* 加载/刷新时菊花图无法取消。
* 无法局部上拉加载。
* 网页右边scroll被隐藏，无法显示

## vue-infinite-loading

### 安装
```
npm install vue-infinite-loading --save
```

### 使用
按照组件的方式引入，如果是下拉加载在加载元素后面引入该组件。

```

//App.vue

//模板
<div class="container">
    <div class="block" v-for="(item,index) in 20" :key="index">{{index}}</div>
    <infinite-loading @infinite="refresh">
      <span slot="no-more">
        There is no more Hacker News :(
      </span>
    </infinite-loading>
 </div>
 
 
//Js
import InfiniteLoading from 'vue-infinite-loading';
  export default {
    components: {
      InfiniteLoading,
    },
}
```
### 基础用法
该组件绑定infinite方法，设置下拉时候的回调，该方法可以传入一个参数，用来通知该组件的数据获取情况。

```
//Js
methods: {
  refresh($state) {
    setTimeout(()=> {
      if(this.show) {
        $state.complete();
      } else {
          this.show = true;
          $state.loaded();
       }
     }, 2000)
   },
}
```
每次数据获取之后都要通知该组件，即执行$state.loaded()，全部数据获取完毕，需要手动执行$state.complete()来展示加载完成的文案，也就是slot中的内容。

### 优缺点
优点
* 上拉和下拉两个方向都可以控制。
* 组件方式引入，更可控。
* 多种loading图可以选择。
* 加载完成时组件可以slot进去，自由度更高。
* 加载图可以隐藏。

缺点
* 每次获取到数据都要通知该组件，稍显复杂。

## vue-infinite-scroll

### 安装

```
npm install vue-infinite-scroll --save
```
### 使用
```
//main.js
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
 
//App.vue
<div v-infinite-scroll="loadMore" :infinite-scroll-disabled="btn" infinite-scroll-distance="10"></div>
```
### 缺点
拉倒最底部的时候，无法手动控制停止触发loadMore方法，即会无限加载，当没有数据返回时候依然会触发该方法。

