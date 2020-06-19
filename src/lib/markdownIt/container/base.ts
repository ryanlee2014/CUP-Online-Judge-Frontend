import Token from "markdown-it/lib/token";
import MarkdownIt from "markdown-it";
const markdownItContainer = require("markdown-it-container/index");

export default function baseFactory (params: string, classValue: string) {
    return function constructor(md: MarkdownIt) {
        md.use(markdownItContainer, params, {
            render(tokens: Token[], idx: number) {
                const m = tokens[idx].info.trim().match(new RegExp(`/^${params}\\s+(.*)$/`));
                if (tokens[idx].nesting === 1) {
                    return `<div class="${classValue}">${null === m ? "" : `<div class="header">${md.utils.escapeHtml(m![1])}</div>`}\n`;
                } else {
                    return `</div>\n`;
                }
            }
        });
    }
}
