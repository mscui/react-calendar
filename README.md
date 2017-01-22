# FIS3 React Calendar demo

## 前期准备

```bash
npm install
npm install fis3 -g
```

## 初始化
启动fis3
详情参见:[fis3](https://github.com/fex-team/fis3/tree/dev)
```bash
cd react-calendar
fis3 init
```

## 运行 & 预览

```bash
fis3 release -w
fis3 server start --type node
```

或者

```
npm start
```

## 产出产品代码

只启用了 js 压缩和 合并。

```
fis3 release production -d ./output
```
或者

```
npm run release
```
