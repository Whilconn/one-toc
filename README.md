<div align="center">
<h1>OneToc</h1>
<p>Table of contents for websites.</p>

![react](https://badges.aleen42.com/src/react.svg)
![typescript](https://badges.aleen42.com/src/typescript.svg)
![vite](https://badges.aleen42.com/src/vitejs.svg)
![jest](https://badges.aleen42.com/src/jest_1.svg)
![eslint](https://badges.aleen42.com/src/eslint.svg)

</div>

为文档、博客、论文等网站添加导航目录的浏览器插件，提供更好的阅读体验。
<br>
It's a browser extension which can append table of contents to the websites such as docs、 blogs and papers, to provide better reading experience.

## 插件效果

![screenshots](screenshots/content.png)

## 特性

- 页面加载完自动解析网页中的标题：`H1 ~ H6`
- 根据标题生成多层级导航目录，便于阅读和跳转
- 随页面滚动自动高亮当前标题
- 支持浅色、深色主题
- 可自由拖拽
- 可自由开关，支持实时开关和快捷键开关
- 可设置浮动或内嵌等定位方式

## 插件安装

### Edge 浏览器

打开[Edge插件商店](https://microsoftedge.microsoft.com/addons/detail/onetoc/jkgapfniamkoblbmbhdjlnfklihlpjmc)页面，点击获取进行安装

### Chrome 浏览器

- 下载[zip包](https://github.com/Whilconn/one-toc/releases)（注意下载的是包名形式为 OneToc-vx.x.x.zip 的包，不要下载Source Code包）
- 解压到任意目录，如 `~/one-toc/`
- 在浏览器打开 chrome://extensions/ 页面
- 点击页面右上角开启 `开发者模式`
- 点击页面左上角 `加载已解压的扩展程序`，最后选择上述解压目录

## 配置说明

点击地址栏右侧的 `OneToc` 图标即可打开配置弹窗，修改配置会立即生效。

![popup](screenshots/popup.png)

### 开启和关闭

插件提供开启和关闭2种状态

- 可使用快捷键快速开启或关闭，Mac `Command+B`，windows/linux `Ctrl+B`

### 主题

插件提供默认、浅色、深色等3种主题

### 定位

插件提供浮动、嵌入等2种定位

- 浮动定位：默认选项，浮动于内容上方，可能会遮挡网页内容，可自由拖拽
- 嵌入定位：嵌入网页左侧，将网页内容整体右移，不会遮挡网页内容，目前可拖拽

> 嵌入效果与 `vscode` 左侧目录边栏类似，同样使用 `Command+B` 快捷键开启或关闭

## 适配情况

- 知乎：https://zhuanlan.zhihu.com
- 简书：https://www.jianshu.com
- 开源中国：https://my.oschina.net
- React 文档：https://zh-hans.reactjs.org
- Eslint 文档：https://eslint.org
- Github：https://github.com
- 博客园：https://www.cnblogs.com
- CSDN：https://blog.csdn.net
- 51cto：https://blog.51cto.com
- 掘金：https://juejin.cn
- 思否：https://segmentfault.com
- NCBI：https://www.ncbi.nlm.nih.gov
- 其他...

## License

[MIT](./LICENSE)

Copyright (c) 2022-present, Whilconn

## 感谢

感谢 JetBrains 提供的开源开发许可证支持！<br>

<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg" width="50px" alt="JetBrains Logo (Main) logo.">&emsp;&emsp;<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/WebStorm_icon.svg" width="50px" alt="WebStorm logo.">
