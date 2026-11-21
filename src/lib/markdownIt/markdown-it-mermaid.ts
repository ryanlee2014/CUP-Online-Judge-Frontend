
// mermaid (~1MB) is loaded lazily by MermaidMixin only when a page actually contains a
// diagram, so the renderer just emits the container here (syntax errors are reported by
// mermaid itself when it renders the block).
const mermaidChart = (code: string) => `<div class="mermaid">${code}</div>`

const MermaidPlugin = (md: any) => {
    const temp = md.renderer.rules.fence.bind(md.renderer.rules)
    md.renderer.rules.fence = (tokens: any, idx: any, options: any, env: any, slf: any) => {
        const token = tokens[idx]
        const code = token.content.trim()
        if (token.info === 'mermaid') {
            return mermaidChart(code)
        }
        const firstLine = code.split(/\n/)[0].trim()
        if (firstLine === 'gantt' ||
            firstLine === 'classDiagram' ||
            firstLine === 'gitGraph' ||
            firstLine === 'sequenceDiagram' ||
            firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
            return mermaidChart(code)
        }
        return temp(tokens, idx, options, env, slf)
    }
}

export default MermaidPlugin
