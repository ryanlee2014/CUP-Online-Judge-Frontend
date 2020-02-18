# GitHub Actions 构建指南

在本目录的`workflows`文件夹中预设两个工作流：

* 发布工作流
* 测试工作流

## 发布工作流

1. 发布工作流将从本仓库和`CUP-Online-Judge-CDN`仓库checkout代码

2. 检查环境是否需要重新构建
    * 需要构建，运行`npm run modern`
    
3. 发布`dist`目录到CDN
