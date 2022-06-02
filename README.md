# one-toc
TOC(Table Of Content) for websites.
<br><br>
Append TOC to the right side of websites such as technical documentation, technical blogs, etc. to provide a better reading experience.
<br><br>
在技术文档、技术博客等网站的右侧添加导航目录的chrome插件，提供更好的阅读体验。
<br><br>
![](screenshots/1.png)

### 如何使用
#### Edge
直接到[Edge插件商店](https://microsoftedge.microsoft.com/addons/detail/onetoc/jkgapfniamkoblbmbhdjlnfklihlpjmc)安装即可 

#### Chrome
- 下载zip包并解压
- 打开 chrome://extensions/ 页面 
- 点击右上角开启开发者模式 
- 点击左上角加载已解压的扩展程序，选择扩展程序目录即可

### 配置说明
- 1、选择启用且链接满足匹配规则的页面才会生成导航目录
- 2、插件默认启用，默认支持的匹配规则如下
```text
*reactjs.org/(docs|blog)/**
*zhihu.com/p/**
*jianshu.com/p/**
*oschina.net/**
*cnblogs.com/**
*csdn.net/**
*github.com/*/**
*eslint.org/docs/**
*eslint.cn/docs/**
```
- 3、匹配规则使用[glob](https://en.wikipedia.org/wiki/Glob_(programming))编写，
- 4、匹配所使用的库是[micromatch](https://github.com/micromatch/micromatch)
- 5、修改配置会立即生效

### 默认支持的网站
- 知乎：https://zhuanlan.zhihu.com/p/24650288
- 简书：https://www.jianshu.com/p/a2cb1e3a79be
- 开源中国：https://my.oschina.net/u/4843764/blog/5528481
- React 文档：https://zh-hans.reactjs.org/
- Eslint 文档：https://eslint.org/docs/user-guide/getting-started
  - http://eslint.cn/docs/user-guide/getting-started
- Github：https://github.com/facebook/react
  - 自带目录，默认关闭，点击Readme标题时出现开启按钮
- 博客园：https://www.cnblogs.com/teach/p/16295605.html
  - 自带目录，默认关闭，hover段落标题时出现开启按钮
- CSDN：https://blog.csdn.net/csdnnews/article/details/124880259
  - 自带目录，不是fixed定位

### 自带目录的网站
- 掘金：https://juejin.cn/post/7076377297623711757
- 思否：https://segmentfault.com/a/1190000041806654

### 不兼容的网站
- 51cto：https://blog.51cto.com/harmonyos/5318953
  - 自带目录默认不出现在可视区域，滚动到偏下位置才出现
  - 自带目录部分文章目录点击无法正确跳转：https://blog.51cto.com/pypypy/5318533
  - TODO：生成目录出现较多无效锚点，选择器不够准确
- iteye：https://www.iteye.com/blog/zhoumeng87-2531925
  - 标题不使用Heading标签（h2、h3等），无法兼容
- infoq：https://www.infoq.cn/article/BwXyBWmqroBpkrEdvV1l
  - TODO：ajax加载数据，目录渲染不出数据
  - TODO：选择器不够准确

### tricks
> 目前默认Heading选择器无法筛选出结果，可以自行修改选择器体验
- bing：https://www.bing.com/
- 百度：https://www.baidu.com/

### 一些问题
- 锚点跳转后被遮挡
  - 目前依靠 URL 的 Hash 改变进行跳转（网页有fixed header时，易出现锚点被遮挡的问题）
  - 可以考虑使用 Scroll Api 控制页面滚动达到跳转效果
- 锚点提取错误：非内容区域的Heading标签（h2、h3等）被提取为锚点
  - 目前默认支持网站的锚点提取比较准确
  - 其他网站由于规范性问题，提取准确性不高，后续待优化
