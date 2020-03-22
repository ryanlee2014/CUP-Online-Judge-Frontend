const MonacoEditorPlugin = require("monaco-editor-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const BrotliPlugin = require("brotli-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
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
        // config.module.rule("js").exclude.add(/\.web\.worker\.js$/);
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
            ],
            module: {
                rules: [
                    {
                        test: /\.web\.worker\.ts$/,
                        use: {
                            loader: "worker-loader",
                            options: {
                                inline: true,
                                publicPath: "/"
                            }
                        }
                    },
                    {
                        test: /\.web\.worker\.ts$/,
                        use: ["ts-loader"],
                        exclude: /node_modules/
                    }
                ]
            }
        };
        if (process.env.NODE_ENV === "production") {
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
    parallel: false,
    productionSourceMap: false
};
