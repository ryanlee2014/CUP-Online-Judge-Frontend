const MonacoEditorPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
    chainWebpack: config => {
        config.module.rule("md")
            .test(/\.md/)
            .use("raw-loader")
            .loader("raw-loader")
            .end();
        config.module.rule("i18n")
            .resourceQuery(/blockType=i18n/)
            .type("javascript/auto")
            .use("i18n")
            .loader("@kazupon/vue-i18n-loader")
            .end();
    },
    devServer: {
        proxy: {
            "/api": {
                secure: false,
                target: "http://acm.cup.edu.cn",
                changeOrigin: true
            },
            "/socket.io": {
                secure: false,
                target: "http://acm.cup.edu.cn",
                changeOrigin: true
            },
            "/avatar": {
                target: "http://acm.cup.edu.cn",
                secure: false,
                changeOrigin: true
            },
            "/image": {
                target: "http://acm.cup.edu.cn",
                secure: false,
                changeOrigin: true
            },
            "/img": {
                target: "http://acm.cup.edu.cn",
                secure: false,
                changeOrigin: true
            },
            "/assets": {
                target: "http://acm.cup.edu.cn",
                secure: false,
                changeOrigin: true
            },
            "/glory_image": {
                target: "http://acm.cup.edu.cn",
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

    assetsDir: "./static",

    pluginOptions: {
        i18n: {
            locale: "cn",
            fallbackLocale: "cn",
            localeDir: "locales",
            enableInSFC: true
        }
    },
    productionSourceMap: false
};
