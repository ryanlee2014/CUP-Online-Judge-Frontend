
// mermaid (~1MB) is loaded lazily by MermaidMixin only when a page actually contains a
// diagram, so the renderer just emits the container here (syntax errors are reported by
// mermaid itself when it renders the block).
const mermaidChart = (code: string) => `<div class="mermaid">${code}</div>`

const loadMermaid = (): Promise<any> =>
    import(/* webpackChunkName: "mermaid" */ 'mermaid').then((m: any) => m.default || m)

const MermaidPlugin = (md: any) => {
    md.mermaid = {
        load: loadMermaid,
        // Same contract as before (returns the resolved preferences synchronously); the
        // initialize() call now happens once mermaid has been loaded on demand.
        loadPreferences (preferenceStore: any) {
            let mermaidTheme = preferenceStore.get('mermaid-theme')
            if (mermaidTheme === undefined) {
                mermaidTheme = 'default'
            }
            let ganttAxisFormat = preferenceStore.get('gantt-axis-format')
            if (ganttAxisFormat === undefined) {
                ganttAxisFormat = '%Y-%m-%d'
            }
            this.ready = loadMermaid().then(mermaid => mermaid.initialize({
                theme: mermaidTheme,
                gantt: {
                    axisFormatter: [
                        [ganttAxisFormat, (d: any) => {
                            return d.getDay() === 1
                        }]
                    ]
                }
            }))
            return {
                'mermaid-theme': mermaidTheme,
                'gantt-axis-format': ganttAxisFormat
            }
        }
    }
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
