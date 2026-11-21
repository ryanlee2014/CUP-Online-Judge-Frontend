// highlight.js core + the languages an OJ actually shows, instead of the full build
// (all ~190 languages, ~1.5MB) that markdown-it-highlightjs pulls in by default.
// @ts-ignore
import hljs from "highlight.js/lib/core";

const languages: { [name: string]: any } = {
    c: require("highlight.js/lib/languages/c"),
    cpp: require("highlight.js/lib/languages/cpp"),
    java: require("highlight.js/lib/languages/java"),
    python: require("highlight.js/lib/languages/python"),
    javascript: require("highlight.js/lib/languages/javascript"),
    typescript: require("highlight.js/lib/languages/typescript"),
    go: require("highlight.js/lib/languages/go"),
    rust: require("highlight.js/lib/languages/rust"),
    kotlin: require("highlight.js/lib/languages/kotlin"),
    csharp: require("highlight.js/lib/languages/csharp"),
    delphi: require("highlight.js/lib/languages/delphi"),
    objectivec: require("highlight.js/lib/languages/objectivec"),
    ruby: require("highlight.js/lib/languages/ruby"),
    php: require("highlight.js/lib/languages/php"),
    perl: require("highlight.js/lib/languages/perl"),
    lua: require("highlight.js/lib/languages/lua"),
    scheme: require("highlight.js/lib/languages/scheme"),
    basic: require("highlight.js/lib/languages/basic"),
    bash: require("highlight.js/lib/languages/bash"),
    shell: require("highlight.js/lib/languages/shell"),
    sql: require("highlight.js/lib/languages/sql"),
    json: require("highlight.js/lib/languages/json"),
    xml: require("highlight.js/lib/languages/xml"),
    markdown: require("highlight.js/lib/languages/markdown"),
    plaintext: require("highlight.js/lib/languages/plaintext")
};
Object.keys(languages).forEach(name => {
    const lang = languages[name];
    hljs.registerLanguage(name, lang.default || lang);
});
hljs.registerAliases(["pascal", "pas", "fpc"], { languageName: "delphi" });
hljs.registerAliases(["c++", "cc", "cxx"], { languageName: "cpp" });
hljs.registerAliases(["text", "txt"], { languageName: "plaintext" });

export default hljs;
