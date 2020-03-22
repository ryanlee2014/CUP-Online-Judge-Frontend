const MonacoEditorPlugin = require("monaco-editor-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const BrotliPlugin = require("brotli-webpack-plugin");
const version = require("./package.json").version;
const webPath = `https://cdn.jsdelivr.net/gh/ryanlee2014/CUP-Online-Judge-CDN@v${version}/`;

module.exports = {
    chainWebpack: config => {
        if (process.env.NODE_ENV === "development") {
            config.output
                .publicPath("/")
                .filename("[name].[hash].js")
                .end();
        }
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
        config.module.rule("js").exclude.add(/\.worker\.js$/);
    },
    devServer: {
        proxy: {
            "/api": {
                secure: false,
                target: "https://hk.haoyuan.info",
                changeOrigin: true
            },
            "/socket.io": {
                secure: false,
                target: "https://hk.haoyuan.info",
                changeOrigin: true
            },
            "/avatar": {
                target: "https://hk.haoyuan.info",
                secure: false,
                changeOrigin: true
            },
            "/image": {
                target: "https://hk.haoyuan.info",
                secure: false,
                changeOrigin: true
            },
            "/upload": {
                target: "https://hk.haoyuan.info",
                secure: false,
                changeOrigin: true
            },
            "/img": {
                target: "https://hk.haoyuan.info",
                secure: false,
                changeOrigin: true
            },
            "/assets": {
                target: "https://hk.haoyuan.info",
                secure: false,
                changeOrigin: true
            },
            "/glory_image": {
                target: "https://hk.haoyuan.info",
                secure: false,
                changeOrigin: true
            }
        }
    },
    publicPath: process.env.NODE_ENV === "production" && !process.env.DISABLE_CDN ? webPath : "/",
    configureWebpack: config => {
        config.plugins.push(new MonacoEditorPlugin());
        config.module.rules.push({
            test: /\.worker\.js$/,
            use: {
                loader: "worker-loader",
                options: {
                    inline: true
                }
            }
        });
        if (process.env.NODE_ENV === "production") {
            config.plugins.push(new CompressionPlugin({
                algorithm (input, compressionOptions, callback) {
                    return zopfli.gzip(input, compressionOptions, callback);
                },
                compressionOptions: {
                    numiterations: 15
                },
                minRatio: 0.99,
                test: /\.(js|css|json|txt|html|ico|svg|png|jpg|eot|woff|woff2|ttf)(\?.*)?$/i
            }));
            config.plugins.push(new BrotliPlugin({
                test: /\.(js|css|json|txt|html|ico|svg|png|jpg|eot|woff|woff2|ttf)(\?.*)?$/i,
                minRatio: 0.99
            }));
        }
        return config;
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
