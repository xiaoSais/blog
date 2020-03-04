# 七、CSS grid

## 容器属性
display: grid; //指定容器内部grid布局

grid-column-rows: 100px 100px 100px; // 指定每一个行的行高

grid-column-columns: 100px 100px 100px; // 指定每一列的列间距

* <b>repeat()</b>
  
  grid-column-rows: repeat(3, 100px); // repeat函数作用与上一个行相同，简化代码量，等同于以下代码
  ```
  grid-column-rows: 100px 100px 100px;
  ```
  grid-column-rows: repeat(3, 100px, 200px) // 重复某种模式，等同于以下代码
  ```
  grid-column-rows: 100px 200px 100px 200px 100px 200px；
  ```
* <b>auto-fill</b>
  
  grid-columns-rows: repeat(auto-fill, 100px) // 容器一行尽量容纳更多的元素

* <b>fr</b>
  
  grid-columns-rows: 150px 1fr 2fr; // 第三个格子的行高是第二个的2倍。注意fr占用的是剩余空间大小，和150px没有任何关系。

* <b>minmax()</b>
  
  grid-columns-rows: repeat(3, minmax(200px, 1fr)) //产生3行，行高在200px和1fr之间，注意这两个单位不能相同。每个参数分别是 length、 percentage、flex 的一种，或者是max-content、min-content、或auto之一。

* <b>auto</b>

  grid-columns-rows: 100px auto 100px; // 产生三行，头和尾都是100px，中间长度铺满，由浏览器决定。

* <b>网格线命名</b>

  grid-columns-rows: [c1] 100px [c2] auto [c3 c4]100px; //指定三个水平网格线c1,c2,c3c4，网格线名字可以有多个

  grid-row-gap: 20px; // 设置行间距。

  grid-column-gap: 20px; // 设置列间距。

  ```
  grid-template-areas: 'a, b, c' 
                       'd, e, f', 
                       'h, g, i' // 设置区域的名字
  ```

  grid-auto-flow: row; // 元素的放置顺序，先行后列(row)，先列后行(column)

  grid-auto-flow: row dense; // 先行后列放置元素，并尽可能的将行先铺满。、

  justify-items | align-items:  start | end | center | stretch; // 单元格内部的水平位置/垂直位置的排列方式。

  place-items: align-items justify-items 的简写方式。

  justify-content | align-content: start | end | center | stretch | space-around | space-between | space-evenly; // 整个内容区域在容器内的对齐方式。

  place-content: justify-content align-content 简写方式。
  
## 项目属性

grid-column-start: 1 // 该项目左边框所在的垂直网格线
  
  * grid-column-start: span 2 // 表示跨越两个格子 
  
grid-row-start: 1 // 项目上边框所在的垂直网格线

grid-column: grid-column-start / grid-column-end; //缩写形式

grid-row: grid-row-start / grid-row-end; // 缩写形式

grid-area: grid-row-start / grid-column-start / grid-row-end / grid-column-end; // 缩写形式

justify-self: center; // 作用和容器的justify-items一致，但是是作用在单个项目上

align-self: center; // 作用和容器的 align-items 一致，也是作用在单个项目上

place-self: align-self | justify-self; //缩写形式