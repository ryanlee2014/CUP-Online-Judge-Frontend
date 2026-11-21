/**
 * worker-loader@3 always builds the worker URL from __webpack_public_path__. With the CDN
 * publicPath used by `npm run modern`, that would make `new Worker()` cross-origin, which
 * browsers reject. worker-loader@2 used its `publicPath` option for the URL instead, so the
 * worker was always fetched from the site origin. This loader runs on worker-loader's
 * generated module and restores that behaviour when a `publicPath` option is given.
 */
module.exports = function (source) {
    const publicPath = (this.getOptions && this.getOptions() || {}).publicPath;
    if (!publicPath) {
        return source;
    }
    return source.replace(/__webpack_public_path__ \+ /g, `${JSON.stringify(publicPath)} + `);
};
