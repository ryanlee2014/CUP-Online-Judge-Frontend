module.exports = {
    runtimeCompiler: true,

    css: {
        modules: true
    },
    devServer: {
        proxy: {
            '/api': {
                secure: false,
                target: 'https://www.cupacm.com',
                changeOrigin: true
            },
            '/socket.io': {
                secure: false,
                target: 'https://www.cupacm.com',
                changeOrigin: true
            },
            '/avatar': {
                target: 'https://www.cupacm.com',
                secure: false,
                changeOrigin: true
            },
            '/image': {
                target: 'https://www.cupacm.com',
                secure: false,
                changeOrigin: true
            },
            '/img': {
                target: 'https://www.cupacm.com',
                secure: false,
                changeOrigin: true
            },
            '/assets': {
                target: 'https://www.cupacm.com',
                secure: false,
                changeOrigin: true
            }
        }

    },
    assetsDir: './static'
};
