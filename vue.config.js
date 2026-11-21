const MonacoEditorPlugin = require("monaco-editor-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const zlib = require("zlib");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const version = require("./package.json").version;
const os = require("os");
const webPath = `https://cdn.jsdelivr.net/gh/ryanlee2014/CUP-Online-Judge-CDN@v${version}/`;
const remoteDev = true;
const devURL = remoteDev ? "https://acm.cup.edu.cn" : "https://hk.haoyuan.info";
const shouldAnalyze = process.env.ANALYZE === "true";
const disableCompress = process.env.DISABLE_COMPRESS === "true";
module.exports = {
    lintOnSave: process.env.NODE_ENV !== "production",
    chainWebpack: config => {
        if (process.env.DISABLE_TYPECHECK === "true") {
            config.plugins.delete("fork-ts-checker");
        }
        // Exclude web worker sources from the default TS rule to avoid thread-loader crashes.
        if (config.module && config.module.rule("ts")) {
            config.module.rule("ts").exclude.add(/\.web\.worker\.ts$/);
            config.module.rule("ts").exclude.add(/\.worker\.ts$/);
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
        if (!process.env.DISABLE_TYPECHECK) {
            config
                .plugin("fork-ts-checker")
                .tap(args => {
                    const totalmem = Math.floor(os.totalmem() / 1024 / 1024); // get OS mem size
                    args[0].typescript = Object.assign({}, args[0].typescript, {
                        memoryLimit: totalmem > 8192 * 2 ? 8192 * 2 : 2048
                    });
                    return args;
                });
        }
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
        client: {
            overlay: {
                warnings: false
            }
        }
    },
    publicPath: process.env.NODE_ENV === "production" && !process.env.DISABLE_CDN ? webPath : "/",
    configureWebpack: config => {
        const configs = {
            plugins: [
                new MonacoEditorPlugin(),
                // webpack 5 no longer injects these Node globals (webpack 4 / Vue CLI 4 did).
                new webpack.ProvidePlugin({
                    process: "process/browser",
                    Buffer: ["buffer", "Buffer"]
                })
            ],
            resolve: {
                alias: {
                    vscode: require.resolve("monaco-languageclient/lib/vscode-compatibility")
                },
                // webpack 5 dropped automatic Node core polyfills. Restore the ones webpack 4
                // (node-libs-browser) provided for html-to-docx, xmlbuilder2 and vscode-jsonrpc,
                // and stub the modules Vue CLI 4 configured as "empty".
                fallback: {
                    assert: require.resolve("assert/"),
                    buffer: require.resolve("buffer/"),
                    crypto: require.resolve("crypto-browserify"),
                    http: require.resolve("stream-http"),
                    https: require.resolve("https-browserify"),
                    os: require.resolve("os-browserify/browser"),
                    path: require.resolve("path-browserify"),
                    stream: require.resolve("stream-browserify"),
                    url: require.resolve("url/"),
                    util: require.resolve("util/"),
                    zlib: require.resolve("browserify-zlib"),
                    child_process: false,
                    dgram: false,
                    fs: false,
                    net: false,
                    tls: false,
                    // only used by asn1.js (via crypto-browserify) inside a try/catch
                    vm: false
                }
            },
            module: {
                rules: [
                    {
                        test: /\.web\.worker\.ts$/,
                        use: [
                            {
                                // keep loading the worker script from the site origin (see loader)
                                loader: require.resolve("./build/worker-public-path-loader"),
                                options: {
                                    publicPath: "/"
                                }
                            },
                            {
                                loader: "worker-loader",
                                options: {
                                    publicPath: "/"
                                }
                            }
                        ]
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
        if (process.env.NODE_ENV === "production" && !disableCompress) {
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
            configs.plugins.push(new CompressionPlugin({
                filename: "[path][base].br",
                algorithm: "brotliCompress",
                compressionOptions: {
                    params: {
                        [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY
                    }
                },
                minRatio: 0.99,
                test: /\.(js|css|json|txt|html|ico|svg|png|jpg|eot|woff|woff2|ttf)(\?.*)?$/i
            }));
        if (shouldAnalyze) {
            config.plugins.push(new BundleAnalyzerPlugin({
                analyzerMode: "static"
            }));
        }
        }
        return configs;
    },

    css: {
        loaderOptions: {
            css: {
                // css-loader 6 (webpack 5) resolves data: URIs and root-relative URLs, which
                // css-loader 3 (Vue CLI 4) left untouched. Keep the old behaviour: semantic-ui ships
                // malformed data URIs (";;base64") and the app references server paths like
                // /template/... that are not part of the bundle.
                url: {
                    filter: url => !/^\s*(data:|\/)/i.test(url)
                }
            }
        }
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
