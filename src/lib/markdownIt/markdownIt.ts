import markdownMermaid from "./markdown-it-mermaid";
import MarkdownIt from "markdown-it";
import warning from "@/lib/markdownIt/container/warning";
import errorFunc from "@/lib/markdownIt/container/error";
import positiveFunc from "@/lib/markdownIt/container/positive";
import messageFunc from "@/lib/markdownIt/container/message";
const uslug = require("uslug");
const uslugify = (s: any) => uslug(s);
const emptyFunc = (src: string, env?: any) => "";

interface MarkdownItExtend extends MarkdownIt {
    renderPlain(src: string, env?: any): string;
    renderRaw (src: string, env?: any): string;
}

function Instance(key = "", problem_id = ""): any {
    const md: MarkdownItExtend = Object.assign(MarkdownIt({
        html: true,
        breaks: true
    }), {
        renderPlain: emptyFunc,
        renderRaw: emptyFunc
    });
    const mh = require("markdown-it-highlightjs");
    const mk = require("@ryanlee2014/markdown-it-katex");
    const mc = require("./markdown-it-table-contents").default;
    const ma = require("markdown-it-anchor").default;
    const mi = require("./markdown-it-images-preview");
    md.use(mk);
    md.use(mh);
    warning(md);
    errorFunc(md);
    positiveFunc(md);
    messageFunc(md);
    md.use(ma, {
        slugify: uslugify
    });
    md.use(mc, {includeLevel: [1, 2], listType: "div class='ui bulleted link list'"});
    md.use(mi);
    md.use(require("./markdown-it-links"));
    md.use(markdownMermaid);

    const markdownPack = (html: string) => {
        return `<div class="markdown-body">${html}</div>`
    };

    const preToSegment = (html: string) => {
        return html.replace(/<pre>[\s\S]+?<\/pre>/g, `<div class='ui segment'>
    <div class="ui top attached label"><a class="copy context">Copy</a></div>$&</div>`)
    };

    const _render = md.render;

    md.render = function (src, env) {
        return markdownPack(preToSegment(_render.call(md, src, env)))
    };

    md.renderPlain = function (src, env) {
        return _render.call(md, src, env);
    }

    md.renderRaw = function (src: string, env?: any) {
        return preToSegment(md.renderInline(src, env));
    };

    return Object.assign(md, {key, problem_id})
}

const md = Instance();
md.newInstance = Instance;
export default md;
