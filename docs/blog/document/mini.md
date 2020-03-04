# 四、初识微信小程序
## 页面调试（自定义编译配置）
### 开发者工具设置
```
开发者工具 =》 编译=》添加编译模式（设置完成项目根目录下project.config.json 相应发生改变）
模式名称: 团进度 //调试的页面名字
启动页面：pages/groupGuide/groupGuide //调试的页面路径,具体到页面文件夹
启动参数：groupId=90 //需要向该页面传递的参数
进入场景： //可以选择不同的调试场景
```
### 代码配置

```
//project.config.json
{
	"conditions": {
		"miniprogram"：{
			"list": {
				{
					"id": 0, //对应在自定义编译列表中的顺序
					"name": "团进度", //对应工具设置中的模式名称
					"pathNmae": "pages/groupGuide/groupGuide"， //对应启动页面
					"query": "goupId=90"， //对应启动参数
				}
			}
		}
	}
}
```
## 微信小程序生命周期
一个小程序的执行顺序总是先执行App.js -》 某个页面

* App.js （全局配置）
  * onLaunch  //小程序初始化，触发一次
  * onShow //小程序启动时触发
  * onHide //同页面
  * onError //页面发生错误时候触发
  * onPageNotFound //页面不存在时触发
* 页面
  * onLoad  //页面加载时触发，一般用来获取跳转参数
  * onShow //页面切入前台|页面显示
  * onReady //页面加载完成，可以与视图层进行交互，类似于Vue的created()
  * onHide //页面切入后台 | 页面隐藏，例如切换tab
  * onUnload //页面跳转到其他页面中触发
## 模板消息（消息推送）
服务消息推送：（1）表单提交 =》 formId，（2）支付 =》 prepay_id
```
//test.wxml
<form bindsubmit="handleSubmitInfo" class="form-wrap" report-submit='true'>
	<button form-type="submit" />
</form>
 
//test.js
handleSubmitInfo: function(param) {
	console.log(param.detail.formId)
	//将formId发送到后台来确定是否发送模板消息
}
```
流程：前端button绑定表单的submit事件 =》 事件处理回调获取formId发送到后台 => 后台根据前台传的formId和tempalte_id决定是否发送以发送什么样的模板消息。

## 自定义组件
在页面对应的json页面直接引入之后，在页面的wxml里直接使用，data通过绑定当前页面数据传递到子组件，注意组件的prop数据传递书写方式
```
//test.wxml
<view>
	<base-layout data="dataA"/>
</view>
 
//test.json
{
	"usingComponents": { "basic-layout": "../../component/basicLayout/basicLayout"}
}
```
## 小程序跳转类
跳转到该小程序其他页面（页面在app.json中已经定义）
* 通过navigator标签控制跳转到其他页面
  ```
  //url为该小程序的页面路由  
  <navigator url="/page/navigate/navigate?title=navigate" open-type="navigate" hover-class="navigator-hover">跳转到新页面</navigator>
  ```

* 通过Js控制跳转

  ```
  //和上面这那种方式是等效的，其中通过js控制有页面跳转成功/失败的回调，通过wxml控制则没有
  wx.navigateTo({
    url: 'test?id=1'
  }， success() => {}, fail() => {})
  ```

跳转到其他小程序
* 通过navigator标签控制跳转到其他绑定的小程序
  ```
  //其中open-type属性值必须为navigate, app-id为跳转的小程序appId（必填），extra-data为传递给小程序的参数
  <navigator target="miniProgram" open-type="navigate" app-id="" path="" extra-data="" version="release" bindsucccess="跳转成功回调" bindfail="跳转失败回调" >打开绑定的小程序</navigator>
  ```

* 通过Js控制跳转到小程序
  ```
  //参数说明同navigator标签，本身这两种方式没有区别
  wx.navigateToMiniProgram({
      appId: '',
      path: 'page/index/index?id=123',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
      // 打开成功
      }
  })
  ```

跳转到tabBar（在页面的json中配置过tab）
* 通过标签跳转
  ```
  //对应的open-type="switchTab"
  <navigator url="/page/navigate/navigate?title=navigate" open-type= "switchTab" hover-class="navigator-hover">跳转到新页面</navigator>
  ```

* 通过Js跳转
  ```
  //page.json中配置tabBar
  {
    "tabBar": {
      "list": [{
        "pagePath": "index",
        "text": "首页"
      },{
        "pagePath": "other",
        "text": "其他"
      }]
    }
  }
  wx.switchTab({
    url: '/index'
  })
  ```

其他

| 路由方式 | 页面栈表现 | Js跳转 | open-type的值（标签跳转） | 触发的生命周期回调 | 说明 |
| :------: | :------: | :------: | :------: | :------: | :------: |
|初始化	|新页面入栈	|无	|无	|onLoad、onShow、onReady|	无|
|打开新页面	|新页面入栈	|wx.navigateTo()| navigate| onHide	|保留当前页面，跳转到新页面 |
|页面重定向	|当前页面出栈，新页面入栈	| wx.redirectTo() | redirectTo	|onUnload|	关闭当前页，打开新页面，当前页面不入栈 |
|页面返回|	页面不断出栈，直到到达目标页面|	wx.navigateBack()| navigateBack|	onUnload	|关闭当前页面，然后返回一级或多级页面 |
|重启动	|页面全部出栈，只留下新的页面	|wx.reLaunch()|	reLaunch|	onUnload|	关闭所有页面，打开到应用内的某个页面
