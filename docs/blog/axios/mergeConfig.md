# 四、选项合并

文件路径 /lib/core/mergeConfig

该文件导出 mergeConfig(config1, config2) 函数，用于两个配置项合并返回新的配置项。在axios源码中用于用户传入的选项和默认的配置进行合并。

### 合并策略

在这个方法中，将配置项的key分为四种，针对不同的key使用不同的合并策略：
  * 'url' | 'method' | 'params' | 'data'
    * 若传入的对应的key的选项值不为空的话，直接使用传入的选项值(config2对应的值)，忽略config1 的值
  * 'headers' | 'auth' | 'proxy'
    * 调用 util.deepMerge(config1[prop], config2[prop]) 函数，得到新的配置对象，不会修改config1 和 config2 的值
  * 'baseURL' | 'url' | 'transformRequest' |'transformResponse' | 'paramsSerializer' 等
    * 如果 config2[prop] 不为 undefined，那么使用 config2[prop]，否则如果 config1[prop]不为 undefined，则使用config1[prop]
  * 如果 config2 中存在不属于以上三种的key，这些 key 的处理情况和第三种一致
