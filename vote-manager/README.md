## 简要说明
使用`wepy`开发小程序，在原有`wepy-cli`的基础上，增加支持如下功能：
* async function
* less autoprefix
* typescript

## 开始之前请阅读

* [wepy开发者文档](https://tencent.github.io/wepy/document.htm)
* [wiki](https://github.com/Tencent/wepy/wiki)
* [typescript](https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html)

## 添加typescript支持

安装最新的alpha版本 `npm install -g wepy-cli@1.6.1-alpha3`，可以看到`wepy`在最新的更新提交中添加了`.ts`文件编译的支持

当然，在接入ts之前，先接入ts和wepy 的混编插件：`wepy-compiler-typescript`

直接执行 `npm install wepy-compiler-typescript --save-dev`

## Couldn't find preset "stage-1"（或es2015） relative to directory
如果出现上面的问题，需要安装：
````
npm i -D babel-preset-stage-1
或者
npm i -D babel-preset-es2015
````