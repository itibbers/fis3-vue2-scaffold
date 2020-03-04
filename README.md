## 安装使用

```bash
# 安装fis3
yarn global add fis3

# 安装依赖
yarn

# 编译预览&实时监听刷新浏览器
yarn dev
```

## 单文件组件

使用Vue.js官方推荐的单文件组件方式，每个组件在同一地方封装它的 CSS 样式，模板和 JavaScript 定义；在FIS3中使用[fis3-parser-vue-component](https://github.com/ccqgithub/fis3-parser-vue-component)构建单文件Vue组件。

## 命名规范

文件、目录、组件名称、页面名称等均采用起始为小写，多个单词使用驼峰法命名。

## 异步加载js

mod方式有提供异步加载js的功能，其书写方式有require.async('moudle')和require(['module'])这两种。为了更加方便与区分理解，异步加载我们统一使用require.async的方式。

## 后记

折腾半天，最后被fis不完善的文档和插件气到，并感叹一个优秀的工具没有及时跟上开源社区的小碎步呀。（泪目

2b大佬这篇搭建流程算比较完善了，可以参考：https://fex.baidu.com/blog/2016/04/develop-react-with-fis3/

还是推荐大家使用官方脚手架工具吧。

