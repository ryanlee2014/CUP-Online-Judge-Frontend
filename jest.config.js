module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testMatch: ["<rootDir>/tests/**/*.spec.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^lodash-es$": "lodash",
        // d3-color 3 为纯 ESM（通过 overrides 修复 ReDoS），Jest 27 走 CJS，映射到其自带的 UMD 构建
        "^d3-color$": "<rootDir>/node_modules/d3-color/dist/d3-color.js",
        "^monaco-editor$": "<rootDir>/tests/__mocks__/empty.js",
        "^mermaid$": "<rootDir>/tests/__mocks__/empty.js",
        "^mermaid/dist/mermaid.core(?:\\.js)?$": "<rootDir>/tests/__mocks__/empty.js",
        "^socket.io-client$": "<rootDir>/tests/__mocks__/empty.js",
        "^html-to-docx$": "<rootDir>/tests/__mocks__/empty.js",
        "^vscode$": "<rootDir>/tests/__mocks__/empty.js",
        "^vscode-languageclient$": "<rootDir>/tests/__mocks__/empty.js",
        "^vscode-languageclient/.*$": "<rootDir>/tests/__mocks__/empty.js",
        "^monaco-languageclient$": "<rootDir>/tests/__mocks__/empty.js",
        "^monaco-languageclient/.*$": "<rootDir>/tests/__mocks__/empty.js",
        "^vscode-ws-jsonrpc$": "<rootDir>/tests/__mocks__/empty.js",
        "^vscode-ws-jsonrpc/.*$": "<rootDir>/tests/__mocks__/empty.js",
        "^vscode-jsonrpc$": "<rootDir>/tests/__mocks__/empty.js",
        "^vscode-jsonrpc/.*$": "<rootDir>/tests/__mocks__/empty.js",
        "\\.wasm$": "<rootDir>/tests/__mocks__/empty.js"
    },
    transform: {
        "^.+\\.vue$": "@vue/vue2-jest",
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    forceCoverageMatch: ["<rootDir>/src/views/**/*.vue"],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/util/util.ts",
        "src/lib/router.ts",
        "src/lib/markdownIt/markdownIt.ts",
        "src/lib/markdownIt/container/*.ts",
        "src/lib/markdownIt/markdown-it-mermaid.ts",
        "src/views/**/*.vue"
    ],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0
        }
    }
};
