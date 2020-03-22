const MonacoEditorPlugin = require("monaco-editor-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const BrotliPlugin = require("brotli-webpack-plugin");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const merge = require("webpack-merge");
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
        config.module
            .rule("worker")
            .test(/\.worker\.js$/)
            .use("worker-loader")
            .loader("worker-loader")
            .tap(options => merge(options, {
                publicPath: "/",
                inline: true
            }));
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
        const configs = {
            plugins: [
                new MonacoEditorPlugin()
            ]
        };
        if (process.env.NODE_ENV === "production") {
            configs.plugins.push(new ParallelUglifyPlugin({
                uglifyJS: {
                    output: {
                        comments: false// 是否保留代码中的注释，默认为保留
                    },
                    warnings: true, // 是否在UglifyJS删除没有用到的代码时输出警告信息，默认为false
                    compress: {
                        drop_console: true, // 是否删除代码中所有的console语句，默认为false
                        collapse_vars: true, // 是否内嵌虽然已经定义了，但是只用到一次的变量， 默认值false
                        reduce_vars: true// 是否提取出现了多次但是没有定义成变量去引用的静态值，默认为false
                    }
                },
                cacheDir: ".cache/", // 用作缓存的可选绝对路径。如果未提供，则不使用缓存。
                sourceMap: false// 可选布尔值。是否为压缩后的代码生成对应的Source Map(浏览器可以在调试代码时定位到源码位置了),这会减慢编译速度。默认为false
            }));
            configs.plugins.push(new CompressionPlugin({
                algorithm (input, compressionOptions, callback) {
                    return zopfli.gzip(input, compressionOptions, callback);
                },
                compressionOptions: {
                    numiterations: 15
                },
                minRatio: 0.99,
                test: /\.(js|css|json|txt|html|ico|svg|png|jpg|eot|woff|woff2|ttf)(\?.*)?$/i
            }));
            configs.plugins.push(new BrotliPlugin({
                test: /\.(js|css|json|txt|html|ico|svg|png|jpg|eot|woff|woff2|ttf)(\?.*)?$/i,
                minRatio: 0.99
            }));
            config.plugins.push(new BundleAnalyzerPlugin({
                analyzerMode: "static"
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
    parallel: true,
    productionSourceMap: false
};
