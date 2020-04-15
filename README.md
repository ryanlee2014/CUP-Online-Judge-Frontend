# CUP-Online-Judge Next Generation Frontend

中国石油大学(北京)在线评测系统前端

CDN版本: [CUP-Online-Judge-CDN](https://github.com/ryanlee2014/CUP-Online-Judge-CDN)
离线版本: [CUP-Online-Judge-Frontend-Local](https://github.com/ryanlee2014/CUP-Online-Judge-Frontend-Local)

**Demo: [CUP-Online-Judge](http://oj.cupacm.com)**

**请保证预留至少4GB的内存空间用于打包构建**

可使用Github Actions进行打包构建
[GitHub Actions 构建指南]()

* 请勿添加以`/api`为前缀的路由，该前缀为后端请求预留。


## Run Vue CLI GUI
```
npm run ui
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
#### Build
```
npm run build
```
move files in `dist` to target folder

### Compiles modern build
```
npm run modern
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
