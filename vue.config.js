const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    runtimeCompiler: true,
    chainWebpack: config => {
        config.module.rule('md')
            .test(/\.md/)
            .use("raw-loader")
            .loader("raw-loader")
            .end()
    },
    devServer: {
        proxy: {
            '/api': {
                secure: false,
                target: 'http://acm.cup.edu.cn',
                changeOrigin: true
            },
            '/socket.io': {
                secure: false,
                target: 'http://acm.cup.edu.cn',
                changeOrigin: true
            },
            '/avatar': {
                target: 'http://acm.cup.edu.cn',
                secure: false,
                changeOrigin: true
            },
            '/image': {
                target: 'http://acm.cup.edu.cn',
                secure: false,
                changeOrigin: true
            },
            '/img': {
                target: 'http://acm.cup.edu.cn',
                secure: false,
                changeOrigin: true
            },
            '/assets': {
                target: 'http://acm.cup.edu.cn',
                secure: false,
                changeOrigin: true
            },
            '/glory_image': {
                target: 'http://acm.cup.edu.cn',
                secure: false,
                changeOrigin: true
            }
        }
    },

    configureWebpack: {
        plugins: [
            new MonacoEditorPlugin()
        ]

    },

    assetsDir: './static'
};
