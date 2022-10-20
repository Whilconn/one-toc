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

![screenshots](screenshots/1.png)

## 感谢

感谢 JetBrains 提供的开源开发许可证支持！<br>

<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg" width="50px" alt="JetBrains Logo (Main) logo.">&emsp;&emsp;<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/WebStorm_icon.svg" width="50px" alt="WebStorm logo.">

## 特性

- 页面加载完自动解析网页中的标题：`H1 ~ H6`
- 生成网页的导航目录，便于阅读和跳转
- 可自由拖拽
- 随页面滚动自动高亮当前标题
- 可设置为默认开启或关闭，且支持实时修改和快捷键修改
- 可设置浮动或内嵌定位方式
- 支持深色主题
- 支持自定义显示规则，可在全部网页显示或特定网页显示

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

插件提供开启或关闭2种状态

- 开启：默认选项，页面加载完成后自动显示 `OneToc`
- 关闭：页面加载完成后不显示 `OneToc`
- 快捷键：Mac `Command+B`，windows/linux `Ctrl+B`

### 主题

插件提供默认、浅色、深色等3种主题

### 定位

插件提供浮动、嵌入等2种定位

- 浮动定位：默认选项，浮动于内容上方，可能会遮挡网页内容，可自由拖拽
- 嵌入定位：嵌入网页左侧，将网页内容整体右移，不会遮挡网页内容，目前可拖拽

> 嵌入效果与 `vscode` 左侧目录边栏类似，同样使用 `Command+B` 快捷键开启或关闭

### 匹配网站

插件提供所有、定制等2种匹配方式

- 所有：默认选项，在所有网站上显示 `OneToc`
- 定制：在指定网站上显示 `OneToc`，需自行编写匹配规则，符合匹配规则的页面才会显示 `OneToc`
  - 匹配规则请使用 [glob](https://en.wikipedia.org/wiki/Glob_(programming)) 编写
  - 匹配逻辑使用的库是 [micromatch](https://github.com/micromatch/micromatch)
  - 示例1：匹配所有页面的规则为 `**`
  - 示例2：常用的技术网站匹配规则如下

```text
*reactjs.org/(docs|blog)/**
*zhihu.com/p/**
*jianshu.com/p/**
*oschina.net/**
*cnblogs.com/**
*csdn.net/**
*github.com/*/**
*eslint.(org|cn)/docs/**
*blog.51cto.com/**
*www.ncbi.nlm.nih.gov/**
```

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

# License

[MIT](./LICENSE)

Copyright (c) 2022-present, Whilconn
