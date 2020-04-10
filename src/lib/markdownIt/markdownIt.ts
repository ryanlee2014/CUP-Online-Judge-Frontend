import markdownMermaid from "./markdown-it-mermaid";
const uslug = require("uslug");
const uslugify = (s: any) => uslug(s);

function Instance(key = "", problem_id = ""): any {
    const md = require("markdown-it")({
        html: true,
        breaks: true
    });
    const mh = require("markdown-it-highlightjs");
    const mk = require("@ryanlee2014/markdown-it-katex");
    const mc = require("./markdown-it-table-contents").default;
    const ma = require("markdown-it-anchor").default;
    const mi = require("./markdown-it-images-preview");
    md.use(mk);
    md.use(mh);
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

    md.render = function () {
        return markdownPack(preToSegment(_render.apply(md, arguments)))
    };

    md.renderPlain = function () {
        return _render.apply(md, arguments);
    }

    md.renderRaw = function () {
        return preToSegment(md.renderInline(...arguments))
    };

    return Object.assign(md, {key, problem_id})
}

const md = Instance();
md.newInstance = Instance;
export default md;
