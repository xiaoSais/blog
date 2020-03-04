(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{230:function(e,r,n){"use strict";n.r(r);var o=n(17),i=Object(o.a)({},(function(){var e=this,r=e.$createElement,n=e._self._c||r;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h1",{attrs:{id:"四、选项合并"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#四、选项合并"}},[e._v("#")]),e._v(" 四、选项合并")]),e._v(" "),n("p",[e._v("文件路径 /lib/core/mergeConfig")]),e._v(" "),n("p",[e._v("该文件导出 mergeConfig(config1, config2) 函数，用于两个配置项合并返回新的配置项。在axios源码中用于用户传入的选项和默认的配置进行合并。")]),e._v(" "),n("h3",{attrs:{id:"合并策略"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#合并策略"}},[e._v("#")]),e._v(" 合并策略")]),e._v(" "),n("p",[e._v("在这个方法中，将配置项的key分为四种，针对不同的key使用不同的合并策略：")]),e._v(" "),n("ul",[n("li",[e._v("'url' | 'method' | 'params' | 'data'\n"),n("ul",[n("li",[e._v("若传入的对应的key的选项值不为空的话，直接使用传入的选项值(config2对应的值)，忽略config1 的值")])])]),e._v(" "),n("li",[e._v("'headers' | 'auth' | 'proxy'\n"),n("ul",[n("li",[e._v("调用 util.deepMerge(config1[prop], config2[prop]) 函数，得到新的配置对象，不会修改config1 和 config2 的值")])])]),e._v(" "),n("li",[e._v("'baseURL' | 'url' | 'transformRequest' |'transformResponse' | 'paramsSerializer' 等\n"),n("ul",[n("li",[e._v("如果 config2[prop] 不为 undefined，那么使用 config2[prop]，否则如果 config1[prop]不为 undefined，则使用config1[prop]")])])]),e._v(" "),n("li",[e._v("如果 config2 中存在不属于以上三种的key，这些 key 的处理情况和第三种一致")])])])}),[],!1,null,null,null);r.default=i.exports}}]);