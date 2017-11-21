# userful_code

> collect useful code

## 概述
本仓库主要收集一些有用的前端代码片段，包括css及js等  
每个片段都会有相关说明，及代码片段。部分有demo


## 关于markDown自动转vue
在dev情况下会执行`transMd.js`脚本，该脚本将`mdPages`下所有md文件解析为vue页面，并为其添加路由  
### 必备标题
1. codeType
2. tips
3. description
4. title
5. pre

标题使用二级标题，必须换行。  
`codeType`参考`router`中`typeConf`   
`tips`参考`router`中`getTips`函数  
`description`为代码片段描述，会作为其标题  
`title`为页面内描述内容  
`pre`为页面内代码片段区  
文件名将默认作为`path，name，componentName`  
**示例**  
```md
## codeType
js

## tips
[1, 1]

## description
获取0-9a-z10位数随机字符串

## title
生成一个10位的包含0-9a-z的字符串  
Number.toString(n) n为进制

## pre
```js
Math.random().toString(36).slice(2)
`` `

```
