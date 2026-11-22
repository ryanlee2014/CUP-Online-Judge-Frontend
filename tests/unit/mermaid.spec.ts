import MarkdownIt from "markdown-it";
import MermaidPlugin from "@/lib/markdownIt/markdown-it-mermaid";
import mermaid from "mermaid";

jest.mock("mermaid", () => ({
    parse: jest.fn(),
    initialize: jest.fn()
}));

const mockedMermaid = mermaid as any;

describe("markdown-it-mermaid", () => {
    beforeEach(() => {
        mockedMermaid.parse.mockReset();
        mockedMermaid.initialize.mockReset();
    });

    it("renders mermaid fences", () => {
        mockedMermaid.parse.mockImplementation(() => undefined);
        const md = new MarkdownIt();
        MermaidPlugin(md);
        const html = md.render("```mermaid\ngraph TB;A-->B\n```");
        expect(html).toContain("class=\"mermaid\"");
    });

    it("renders mermaid from first line detection", () => {
        mockedMermaid.parse.mockImplementation(() => undefined);
        const md = new MarkdownIt();
        MermaidPlugin(md);
        const html = md.render("```\nsequenceDiagram\nA->B\n```");
        expect(html).toContain("class=\"mermaid\"");
    });

    it("falls back to default fence renderer", () => {
        mockedMermaid.parse.mockImplementation(() => undefined);
        const md = new MarkdownIt();
        MermaidPlugin(md);
        const html = md.render("```js\nconst a = 1\n```");
        expect(html).toContain("language-js");
    });

    it("leaves invalid diagrams to mermaid itself (no eager parse)", () => {
        // mermaid is loaded lazily when a diagram is rendered, so the markdown renderer no
        // longer parses eagerly; mermaid reports syntax errors when it renders the block.
        const md = new MarkdownIt();
        MermaidPlugin(md);
        const html = md.render("```mermaid\nbad\n```");
        expect(html).toContain("<div class=\"mermaid\">bad</div>");
        expect(mockedMermaid.parse).not.toHaveBeenCalled();
    });

    it("loads preferences with defaults", async () => {
        const md = new MarkdownIt();
        MermaidPlugin(md);
        const preferenceStore = { get: jest.fn().mockReturnValue(undefined) };
        const result = (md as any).mermaid.loadPreferences(preferenceStore);
        expect(result).toEqual({
            "mermaid-theme": "default",
            "gantt-axis-format": "%Y-%m-%d"
        });
        await (md as any).mermaid.ready;
        expect(mockedMermaid.initialize).toHaveBeenCalled();
        const initArgs = mockedMermaid.initialize.mock.calls[0][0];
        const axisFormatter = initArgs.gantt.axisFormatter[0][1];
        expect(axisFormatter(new Date("2026-01-05"))).toBe(true);
        expect(axisFormatter(new Date("2026-01-06"))).toBe(false);
    });

    it("loads preferences with custom values", () => {
        const md = new MarkdownIt();
        MermaidPlugin(md);
        const preferenceStore = {
            get: jest.fn((key: string) => {
                if (key === "mermaid-theme") {
                    return "forest";
                }
                if (key === "gantt-axis-format") {
                    return "%Y";
                }
                return undefined;
            })
        };
        const result = (md as any).mermaid.loadPreferences(preferenceStore);
        expect(result).toEqual({
            "mermaid-theme": "forest",
            "gantt-axis-format": "%Y"
        });
    });
});
