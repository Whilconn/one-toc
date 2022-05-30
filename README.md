# one-toc
为react官方文档添加文档目录的chrome插件

### 一些问题
- header 偏移
  - 默认偏移量：60px
  - header高度覆盖默认
- 锚点控制
  - id、name
  - 点击事件控制
- 解析错误：非内容区域的h2、h3被解析为锚点

### 没有目录的网站
- 知乎：https://zhuanlan.zhihu.com/p/24650288
- 简书：https://www.jianshu.com/p/a2cb1e3a79be
- oschina：https://my.oschina.net/u/4843764/blog/5528481
- react-doc：https://zh-hans.reactjs.org/

### 有目录但难以发现的网站
- github：https://github.com/facebook/react
  - 默认关闭，点击Readme标题时出现开启按钮
- cnblogs：https://www.cnblogs.com/teach/p/16295605.html
  - 默认关闭，hover标题时出现开启按钮
- 51cto：https://blog.51cto.com/harmonyos/5318953
  - 默认不出现在可视区域，滚动到偏下位置才出现
  - 部分文章目录点击无法正确跳转：https://blog.51cto.com/pypypy/5318533
- csdn：https://blog.csdn.net/csdnnews/article/details/124880259
  - 有点飘，有点晃

### 有目录的网站
- 掘金：https://juejin.cn/post/7076377297623711757
- 思否：https://segmentfault.com/a/1190000041806654

### 不兼容的网站
- iteye：https://www.iteye.com/blog/zhoumeng87-2531925
  - 标题不使用h2、h3标签，无法兼容
- infoq：https://www.infoq.cn/article/BwXyBWmqroBpkrEdvV1l
  - TODO：ajax加载数据，目录渲染不出数据
  - TODO：选择器不够准确

### 整活网站
> 目前默认选择器无法筛选出结果，可以自行修改选择器配置体验
- bing：https://www.bing.com/
- 百度：https://www.baidu.com/