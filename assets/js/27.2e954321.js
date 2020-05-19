(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{391:function(s,a,e){"use strict";e.r(a);var t=e(25),n=Object(t.a)({},(function(){var s=this,a=s.$createElement,e=s._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("h1",{attrs:{id:"三、yuidoc不完全指北"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#三、yuidoc不完全指北"}},[s._v("#")]),s._v(" 三、YUIDoc不完全指北")]),s._v(" "),e("h2",{attrs:{id:"安装"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#安装"}},[s._v("#")]),s._v(" 安装")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("npm -g install yuidocjs\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("h2",{attrs:{id:"语法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#语法"}},[s._v("#")]),s._v(" 语法")]),s._v(" "),e("p",[s._v("文件开头，开头有一段该文件的描述信息，@module指代当前文件属于API或者是组件，@class 指代当前类别，@author指代作者名字")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("Eg: \n/**\n * 用于处理get请求的类\n * @module API\n * @class Request\n */\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br")])]),e("p",[s._v("方法开头，方法开头会有一段文字描述，描述该方法的作用和功能，@method 指代当前方法名，@param url {String}， url指代参数名字，String指代类型，@return {Promise} 指代返回值类型")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("Eg:\n/**\n * 该方法可以根据Get请求是否为JSONP跨域请求，动态选择使用jsonp插件或者axios插件来处理该请求\n * @method commonRequest\n * @param url {String} 请求的url \n * @param isJSONP {Boolean} 该Get请求是否为JSONP请求\n * @return {Promise} 返回包含请求结果的Promise\n */\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br"),e("span",{staticClass:"line-number"},[s._v("7")]),e("br"),e("span",{staticClass:"line-number"},[s._v("8")]),e("br")])]),e("p",[s._v("变量/常亮开头（如果有需要），开头会有一段文字描述其作用。@propety 指代该属性名字，@final 指代该属性类型，可以省略，@type 指代其类型")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("\nEg:\n/**\n * 各种环境下的项目host、path地址配置\n * @property envConfig\n * @final\n * @type Object\n */\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br"),e("span",{staticClass:"line-number"},[s._v("7")]),e("br"),e("span",{staticClass:"line-number"},[s._v("8")]),e("br")])]),e("h2",{attrs:{id:"文档生成"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#文档生成"}},[s._v("#")]),s._v(" 文档生成")]),s._v(" "),e("p",[s._v("在项目根目录下，在命令行中输入以下代码会在项目根目录生成out文件夹，打开index.html文件就会看到该文档。")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("yuidoc .\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("h2",{attrs:{id:"进展"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#进展"}},[s._v("#")]),s._v(" 进展")]),s._v(" "),e("ul",[e("li",[s._v("discovery_h5项目 src\\commons 文件夹下的所有文件都已注释完毕")]),s._v(" "),e("li",[s._v("model.js  16个方法")]),s._v(" "),e("li",[s._v("polyfill.js 1个方法")]),s._v(" "),e("li",[s._v("store.js 1个方法")]),s._v(" "),e("li",[s._v("util.js 25个方法")]),s._v(" "),e("li",[s._v("request.js 2个方法，2个property")])]),s._v(" "),e("h2",{attrs:{id:"收获与总结"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#收获与总结"}},[s._v("#")]),s._v(" 收获与总结")]),s._v(" "),e("p",[s._v("了解了YUIDoc工具的用法，以及该工具的代码注释语法，更加熟悉了dicsovery_h5项目的代码，以后尽量在项目中写这种规范的注释，以便于生成自动化文档便于查询。")])])}),[],!1,null,null,null);a.default=n.exports}}]);