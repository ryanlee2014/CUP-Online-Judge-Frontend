import Mermaid from 'mermaid'


const MermaidChart = (code: string) => {
    try {
        const needsUniqueId = "render" + (Math.floor(Math.random() * 10000)).toString();
        Mermaid.mermaidAPI.render(needsUniqueId, code, sc => {
            code = sc
        });
        return `<div class="mermaid">${code}</div>`
    } catch ({str, hash}) {
        return `<pre>${str}</pre>`
    }
};

const MermaidPlugIn = (md: any, opts: any) => {
    Mermaid.initialize(Object.assign(MermaidPlugIn.default, opts));

    const defaultRenderer = md.renderer.rules.fence.bind(md.renderer.rules);

    md.renderer.rules.fence = (tokens: any, idx: any, opts: any, env: any, self: any) => {
        const token = tokens[idx];
        const code = `${token.info} \n ${token.content.trim()}`;
        if (token.info === 'mermaid' || token.info === 'gantt' || token.info.match(/^pie/) || token.info === 'sequenceDiagram' || token.info === 'classDiagram' || token.info === 'gitGraph' || token.info.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
            return MermaidChart(code)
        }
        // const firstLine = code.split(/\n/)[0].trim()
        // if (firstLine === 'gantt' || firstLine === 'sequenceDiagram' || firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
        //   return mermaidChart(code)
        // }
        return defaultRenderer(tokens, idx, opts, env, self)
    }
};

MermaidPlugIn.default = {
    startOnLoad: false,
    securityLevel: 'true',
    theme: "default",
    flowchart: {
        htmlLabels: false,
        useMaxWidth: true,
    }
};

export default MermaidPlugIn
