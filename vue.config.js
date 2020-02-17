const MonacoEditorPlugin = require("monaco-editor-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const version = require("./package.json").version;
const webPath = `https://cdn.jsdelivr.net/gh/ryanlee2014/CUP-Online-Judge-CDN@v${version}/`;

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
                target: "https://www.cupacm.com",
                changeOrigin: true
            },
            "/socket.io": {
                secure: false,
                target: "https://www.cupacm.com",
                changeOrigin: true
            },
            "/avatar": {
                target: "https://www.cupacm.com",
                secure: false,
                changeOrigin: true
            },
            "/image": {
                target: "https://www.cupacm.com",
                secure: false,
                changeOrigin: true
            },
            "/upload": {
                target: "https://www.cupacm.com",
                secure: false,
                changeOrigin: true
            },
            "/img": {
                target: "https://www.cupacm.com",
                secure: false,
                changeOrigin: true
            },
            "/assets": {
                target: "https://www.cupacm.com",
                secure: false,
                changeOrigin: true
            },
            "/glory_image": {
                target: "https://www.cupacm.com",
                secure: false,
                changeOrigin: true
            }
        }
    },
    publicPath: process.env.NODE_ENV === "production" ? webPath : "/",
    configureWebpack: config => {
        const configs = {
            plugins: [
                new MonacoEditorPlugin()
            ]
        };
        if (process.env.NODE_ENV === "production") {
            configs.plugins.push(new CompressionPlugin({
                test: /\.js$|\.html$|\.css/,
                threshold: 10240,
                deleteOriginalAssets: false
            }));
        }
        return configs;
    },

    assetsDir: "./static",

    pluginOptions: {
        i18n: {
            locale: "cn",
            fallbackLocale: "cn",
            localeDir: "locales",
            enableInSFC: true
        },
        webpackBundleAnalyzer: {
            openAnalyzer: false,
            analyzerMode: "disabled"
        }
    },
    productionSourceMap: false
};
