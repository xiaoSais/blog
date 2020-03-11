(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{234:function(s,a,t){"use strict";t.r(a);var r=t(17),e=Object(r.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"五、js循环语句中的性能分析"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#五、js循环语句中的性能分析"}},[s._v("#")]),s._v(" 五、JS循环语句中的性能分析")]),s._v(" "),t("h2",{attrs:{id:"描述"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#描述"}},[s._v("#")]),s._v(" 描述")]),s._v(" "),t("p",[s._v("循环相同的次数，执行同一个操作，（这里都是简单赋值操作）测试每一种循环所需要的时间尽量不要用for…in来循环数组，因为在数组中自定义的属性，也会在循环中遍历到，而且性能极差，用for…of本身是不能直接遍历对象的，需要使用Object.keys()方法将对象属性转化成可循环列表，for…of来循环数组的时候，好像只能获取到相应的key无法获取到Index，这个问题很尴尬。")]),s._v(" "),t("h2",{attrs:{id:"种类"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#种类"}},[s._v("#")]),s._v(" 种类")]),s._v(" "),t("h3",{attrs:{id:"数组"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#数组"}},[s._v("#")]),s._v(" 数组")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("for\nwhile\nforach\nfor…in\nfor…of\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br")])]),t("h3",{attrs:{id:"对象"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#对象"}},[s._v("#")]),s._v(" 对象")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("for…in\nfor…of\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])]),t("h2",{attrs:{id:"结论"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#结论"}},[s._v("#")]),s._v(" 结论")]),s._v(" "),t("ul",[t("li",[t("p",[s._v("对于数组来说无论遍历的数量级大小，性能总是以下排名，其中前三个在千万级的循环次数中，差别不是很大:")]),s._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),t("p",[s._v("for > for..of > while > forach > for…in,")])])]),s._v(" "),t("li",[t("p",[s._v("对于对象来说，性能结果如下：")]),s._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),t("p",[s._v("for…of > for…in")])])])]),s._v(" "),t("h2",{attrs:{id:"附录"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#附录"}},[s._v("#")]),s._v(" 附录")]),s._v(" "),t("p",[s._v("附在10000000次循环中，各种循环所需要消耗的时间为:")]),s._v(" "),t("ul",[t("li",[s._v("数组：\n"),t("ul",[t("li",[s._v("for语句循环所需的时间为：20ms")]),s._v(" "),t("li",[s._v("for…of 语句循环所需的时间为：26ms")]),s._v(" "),t("li",[s._v("while语句循环所需的时间为：26ms")]),s._v(" "),t("li",[s._v("forEach语句循环所需的时间为：84ms")]),s._v(" "),t("li",[s._v("for…in 语句循环所需的时间为(不推荐)：1879ms")])])]),s._v(" "),t("li",[s._v("对象：\n"),t("ul",[t("li",[s._v("for…in 语句循环所需的时间为：1595ms")]),s._v(" "),t("li",[s._v("for…of 语句循环所需的时间为：1622ms")])])])])])}),[],!1,null,null,null);a.default=e.exports}}]);