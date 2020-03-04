# 动态规划

## 斐波那契数列问题的递归和动态规划

> Q1: 给定整数 N，返回斐波那契数列的第 N 项

思路：斐波那契数列（Fibonacci sequence），又称黄金分割数列、因数学家列昂纳多·斐波那契（Leonardoda Fibonacci）以兔子繁殖为例子而引入，故又称为“兔子数列”，指的是这样一个数列：1、1、2、3、5、8、13、21、34、……

### 思路

#### 问题转化

设 F(N) 为斐波那契数列的第 N 项。

#### 找递推公式

F(N) = F(N-1) + F(N-2)

#### 找初值

F(1) = 1, F(2) = 1

#### 转化为代码

```
  function fib(N) {
    let F = []
    F[1] = 1;
    F[2] = 1;
    for (let i = 3; i <= N; i++) {
      F[i] = F[i-1] + F[i-2]
    }
    return F[N]
  }
```
时间复杂度为 O(n), 空间复杂度为O(n);

### 优化

只保留 F(N-1) 和 F(N-2)

```
  function fib(N) {
    let pre1 = 1
    let pre2 = 1
    let res
    for (let i = 3; i <= N; i++) {
      res = pre1 + pre2
      pre2 = pre1
      pre1 = res
    }
    return res
  }
```

时间复杂度为 O(n), 空间复杂度为O(1)

> Q2: 一只青蛙一次可以跳上1级台阶，也可以跳上2级。求该青蛙跳上一个n级的台阶总共有多少种跳法（先后次序不同算不同的结果）。

### 思路

### 问题转化

设 F(n) 为 n 级台阶总共的跳法。

### 递推公式

第 n 级台阶，要么是在 n - 1 级台阶跳上去的，要么是在 n-2 级台阶跳上去的。从 n - 1 级台阶跳上去总共就一种跳法， 从 n - 2 级台阶跳上去有两种（一级一级跳和一下跳两级）但是要去掉一种重复的（一级一级跳）。所以有递推公示:

F(n) = F(n-1) + F(n-2)

### 找初值

F(1) = 1; F(2) = 2; F(3) = 3

### 转化为代码

```
  function jumpFloor(number) {
    if (number <= 2) return number
    let pre1 = 2
    let pre2 = 1
    let res
    for (let i = 3; i<=number; i++) {
      res = pre1 + pre2
      pre2 = pre1
      pre1 = res 
    }
    return res
  }
```

> Q3: 假设农场中成熟的母牛每年只会生 1 头小母牛，并且永远不会死。第一年农场有 1 只成熟的母牛，从第二年开始，母牛开始生小母牛， 每只小母牛 3 年之后成熟又可以生小母牛。给定整数 N，求出 N 年后牛的数量。

### 思路

#### 问题转化

F(N) 为 N 年后牛的数量。

#### 递推公示

第 N 年牛的数量为第 N - 1 年牛的数量 + 新增的小牛，新增的小牛应该是 N - 3 年牛的数量。

即： F(N) = F(N-1) +  F(N-3)

#### 找初值

F(1) = 1; F(2) = 2; F(3) = 3; F(4) = 4

#### 转化成代码

```
  function cowCount(N) {
    if (N <= 3) return N
    var n1 = 1;
    var n2 = 2;
    var n3 = 3;
    var res
    for (var i = 4; i <= N; i++) {
      res = n1 + n3
      n1 = n2
      n2 = n3
      n3 = res
    }
    return res
  }
```

## 矩阵的最小路径和
 
