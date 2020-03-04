# 三、YUIDoc不完全指北



## 安装
```
npm -g install yuidocjs
```
## 语法

文件开头，开头有一段该文件的描述信息，@module指代当前文件属于API或者是组件，@class 指代当前类别，@author指代作者名字
```
Eg: 
/**
 * 用于处理get请求的类
 * @module API
 * @class Request
 */
```
方法开头，方法开头会有一段文字描述，描述该方法的作用和功能，@method 指代当前方法名，@param url {String}， url指代参数名字，String指代类型，@return {Promise} 指代返回值类型 

```
Eg:
/**
 * 该方法可以根据Get请求是否为JSONP跨域请求，动态选择使用jsonp插件或者axios插件来处理该请求
 * @method commonRequest
 * @param url {String} 请求的url 
 * @param isJSONP {Boolean} 该Get请求是否为JSONP请求
 * @return {Promise} 返回包含请求结果的Promise
 */
```
变量/常亮开头（如果有需要），开头会有一段文字描述其作用。@propety 指代该属性名字，@final 指代该属性类型，可以省略，@type 指代其类型

```

Eg:
/**
 * 各种环境下的项目host、path地址配置
 * @property envConfig
 * @final
 * @type Object
 */
```
## 文档生成
在项目根目录下，在命令行中输入以下代码会在项目根目录生成out文件夹，打开index.html文件就会看到该文档。

```
yuidoc .
```

## 进展
* discovery_h5项目 src\commons 文件夹下的所有文件都已注释完毕
* model.js  16个方法
* polyfill.js 1个方法
* store.js 1个方法
* util.js 25个方法
* request.js 2个方法，2个property

## 收获与总结
了解了YUIDoc工具的用法，以及该工具的代码注释语法，更加熟悉了dicsovery_h5项目的代码，以后尽量在项目中写这种规范的注释，以便于生成自动化文档便于查询。