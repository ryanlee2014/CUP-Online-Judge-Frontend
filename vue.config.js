module.exports = {
    runtimeCompiler: true,

    css: {
        modules: true
    },
    devServer: {
        proxy: {
            //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
            '/api': {
                target: 'http://192.168.28.150:3000',//你要跨域的网址  比如  'http://news.baidu.com',
                changeOrigin: true,//这个参数是用来回避跨站问题的，配置完之后发请求时会自动修改http header里面的host，但是不会修改别的
                pathRewrite: {
                    '^/api': ''//路径的替换规则
                    //这里的配置是正则表达式，以/api开头的将会被用用‘/api’替换掉，假如后台文档的接口是 /api/list/xxx
                    //前端api接口写：axios.get('/api/list/xxx') ， 被处理之后实际访问的是：http://news.baidu.com/api/list/xxx
                }
            },
            '/test': {
                target: 'http://192.168.28.150:3000',//你要跨域的网址  比如  'http://news.baidu.com',
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,//这个参数是用来回避跨站问题的，配置完之后发请求时会自动修改http header里面的host，但是不会修改别的
                pathRewrite: {
                    '^/test': '/'//路径的替换规则
                    //这里的配置是正则表达式，以/api开头的将会被用用‘/api’替换掉，假如后台文档的接口是 /api/list/xxx
                    //前端api接口写：axios.get('/api/list/xxx') ， 被处理之后实际访问的是：http://news.baidu.com/api/list/xxx
                }
            },
            '/avatar': {
                target: 'https://www.cupacm.com',//你要跨域的网址  比如  'http://news.baidu.com',
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true
            },
            '/image': {
                target: 'https://www.cupacm.com',//你要跨域的网址  比如  'http://news.baidu.com',
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true
            }
        }

    },
    assetsDir: './static'
};
