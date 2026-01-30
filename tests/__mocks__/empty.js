const emptyBase = function () {
    return Promise.resolve(new Blob());
};
const monacoEditor = {
    createModel: () => ({ setValue: () => {} }),
    createDiffEditor: () => ({ setModel: () => {}, dispose: () => {} }),
    create: () => ({
        getModel: () => ({ setValue: () => {} }),
        updateOptions: () => {},
        layout: () => {},
        dispose: () => {}
    }),
    setTheme: () => {}
};
const empty = new Proxy(emptyBase, {
    apply: (_target, _thisArg, _args) => emptyBase(),
    get: (_target, prop) => {
        if (prop === "editor") return monacoEditor;
        return empty;
    }
});

module.exports = empty;
module.exports.__esModule = true;
module.exports.default = empty;
module.exports.editor = monacoEditor;
