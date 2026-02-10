# CUP Online Judge Frontend

中国石油大学(北京)在线评测系统前端

CDN版本: [CUP-Online-Judge-CDN](https://github.com/ryanlee2014/CUP-Online-Judge-CDN)

离线版本: [CUP-Online-Judge-Frontend-Local](https://github.com/ryanlee2014/CUP-Online-Judge-Frontend-Local)


**Demo: [CUP-Online-Judge](http://oj.cupacm.com)**

**请保证预留至少7GB的内存空间用于打包构建**

## 环境要求（建议）
- 推荐：Node.js **18.x**（与 GitHub Actions 构建环境一致）
- 如果你使用 Node.js **22.x** 本地构建：需要手动设置 OpenSSL 兼容开关，否则可能出现 `error:0308010C:digital envelope routines::unsupported`

Windows (cmd)：
```bat
set NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

macOS/Linux (bash)：
```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

可使用 GitHub Actions 进行打包构建：
[GitHub Actions 构建](https://github.com/ryanlee2014/CUP-Online-Judge-Frontend/actions)

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
