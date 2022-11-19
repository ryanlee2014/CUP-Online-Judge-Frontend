const MonacoEditorPlugin = require("monaco-editor-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const BrotliPlugin = require("brotli-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const version = require("./package.json").version;
const os = require("os");
const webPath = `https://cdn.jsdelivr.net/gh/ryanlee2014/CUP-Online-Judge-CDN@v${version}/`;
const remoteDev = true;
const devURL = remoteDev ? "https://acm.cup.edu.cn" : "https://hk.haoyuan.info";
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
        config
            .plugin("fork-ts-checker")
            .tap(args => {
                const totalmem = Math.floor(os.totalmem() / 1024 / 1024); // get OS mem size
                args[0].memoryLimit = totalmem > 8192 * 2 ? 8192 * 2 : 2048;
                return args;
            });
    },
    devServer: {
        proxy: {
            "/api": {
                secure: false,
                target: devURL,
                changeOrigin: true
            },
            "/socket.io": {
                secure: false,
                target: devURL,
                changeOrigin: true
            },
            "/language-server": {
                secure: false,
                target: devURL,
                changeOrigin: true
            },
            "/avatar": {
                target: devURL,
                secure: false,
                changeOrigin: true
            },
            "/geoip": {
                target: devURL,
                secure: false,
                changeOrigin: true
            },
            "/image": {
                target: devURL,
                secure: false,
                changeOrigin: true
            },
            "/upload": {
                target: devURL,
                secure: false,
                changeOrigin: true
            },
            "/img": {
                target: devURL,
                secure: false,
                changeOrigin: true
            },
            "/assets": {
                target: devURL,
                secure: false,
                changeOrigin: true
            },
            "/glory_image": {
                target: devURL,
                secure: false,
                changeOrigin: true
            }
        },
        overlay: {
            warnings: false
        }
    },
    publicPath: process.env.NODE_ENV === "production" && !process.env.DISABLE_CDN ? webPath : "/",
    configureWebpack: config => {
        const configs = {
            plugins: [
                new MonacoEditorPlugin()
            ],
            resolve: {
                alias: {
                    vscode: require.resolve("monaco-languageclient/lib/vscode-compatibility")
                }
            },
            module: {
                rules: [
                    {
                        test: /\.web\.worker\.ts$/,
                        loader: "worker-loader",
                        options: {
                            publicPath: "/"
                        }
                    },
                    {
                        test: /\.web\.worker\.ts$/,
                        use: ["ts-loader"],
                        exclude: /node_modules/
                    },
                    {
                        test: /\.wasm$/,
                        loader: "file-loader",
                        type: "javascript/auto"
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
