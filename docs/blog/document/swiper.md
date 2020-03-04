# 一、swiper插件的坑，你了解多少

## 引入和基本用法
引用之前需要安装vue-awesome-swiper组件，然后像引用其他组件一样引入即可。其中swiper类似于滑动对象的容器，swiper-slide为滑动的单个item。

```
//template
<swiper :options="swiperOptions">
	<swiper-slide v-for="item in data">
 
	</swiper-slide>
</swiper>

//js
import { swiper, swiperSlide } from 'vue-awesome-swiper'
```

## 配置选项
Vue-awosome-swipet 的Options可以配置所有的swiper配置和方法，需要在data里返回。

```
//js
data() {
	return {
		swiperOptions: [
			//基本配置和方法，
			loopedSides: 8 //设置复制层的层数
			onTouchMove: this.cd() //滑动时触发回调
		]
	}
},
methods: {
	cb() {
		console.log('开始滑动');
	}
}
```

## swiper实例
swiper属性和方法需要通过swiper进行访问和调用。在该组件获取swiper对象的方法如下，注意要等整个Dom加载完成才能获取，并且data里要有数据，否则就会报错。

```
//template
<swiper :options="swiperOptions" ref="mySwiper">
	<swiper-slide v-for="item in data"></swiper-slide>
</swiper>

//js
computed: {
	getSwiper() {
		return this.$ref.mySwiper.swiper;
	}	
},
methods: {
	getIndex() {
		return this.getSwiper.activeIndex; //获取swiper实例当前活动的item
	}
}
```

## 样式调整
一般需要调整两个slide样式，即非活动slide和活动slide，这两个样式分别通过.swiper-slide 和.swiper-slide-active进行调整。

```
//在template里无需设置slide的class为swiper-slide，直接在style中使用即可。
<style>
	.swiper-slide {
		//非活动状态下的slide样式
	}
	.swiper-slide-active {
		//活动状态下的slide样式
	}
</style>
```
这两个样式的名字可以通过options进行设置，详见swiper文档命名空间。

## sidesPreview相关
这个选项代表当前视图出现的slide的个数，它有两个值。

```
data() {
	options: [
		sidesPreview: 2.3 //指当前视图出现2.3的滑动slide。
		sidesPreview: 'auto' //根据设置的slide宽度和active的slide宽度自行计算当前视图出现的slide个数。
	]
}
```
注意设置固定值会使得修改active-class 无法改变active slide的宽度，所有的slide会固定宽度。但是可以通过transform来实现宽度的改变，（推荐使用这种方式）；<b>设置'auto'你可以设置active和非active的item的宽度，但是经常出现滑动时到不了指定位置的问题</b>，这是一个天坑。

## 边距相关
边距可以通过选项和css实现，spaceBetwwen代表两个slide之间的距离，最左边slide距离（active slide）容器的宽度可以通过.swiper-slide-active 设置。距离右边容器的距离通过 slidesOffsetAfter 实现。

```
//js
data() {
	options: [
		spaceBetween: 10 //这里的单位为px
		spaceBetween: window.innerWidth*.25 //或者根据窗口大小动态改变
		slidesOffsetAfter： 20 //一般需要动态调整
	]
}
 
//css
.swiper-slide-active {
	margin-left: 20px; //active距离左边容器的距离，默认模式下，即没有设置active slide居中选项。
    margin-right: 20px; //在固定sidesPreview的情况下，设置margin-right是无效的。
}
```
## Loop相关

循环模式可以通过options数组里loop属性进行设置。这个模式有三个坑:

* 该模式下会自动在第一个slide前面复制一个带有.swiper-slide-duplicate类名的复制层，该复制层是复制最后一个slide而来，同样最后一个层后面会复制第一个层形成一个新的复制层。
* 该模式下出现的复制层无法复制对应层的组件和事件。
* 复制层第一次发生Touchmove的时候会瞬变到非复制层，如果图片是懒加载的话，会出现图片重复加载的情况。

解决方案：
* Loop模式下最好在options里配置 loopedSides选项，代表设置的loop层数量。一般设置为data的长度。 排列顺序为  0,1,2,0,1,2,0,1,2   其中红色代表复制层。
* 手动为复制层添加组件和事件，然后放在this.$nextTick(()=> {})中编译一下。
* 监听onSlideChange()事件，手动将相同index的图片地址赋值为相同的地址。
  
## 异步加载
异步加载的时候很容易出错，如果data没有值，swiper组件就不会初始化，获取swiper实例也会出错。解决方案也很简单。用v-if 绑定data的长度。

```
//swiperDemo.vue
<template>
	<div v-if="data.length">
		<swiper :options="swiperOptions">
			<swiper-slide v-for="item in data"></swiper-slide>
		</swiper>
	</div>
</template>
 
//parents.vue
<swiper v-if="data.length" :data="data"></swiper>
```