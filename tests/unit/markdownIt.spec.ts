import MarkdownIt from "markdown-it";
import baseFactory from "@/lib/markdownIt/container/base";

import md from "@/lib/markdownIt/markdownIt";

jest.mock("mermaid", () => ({
    parse: jest.fn(),
    initialize: jest.fn()
}));

describe("markdownIt containers", () => {
    it("renders container without title", () => {
        const local = new MarkdownIt();
        baseFactory("warning", "ui warning message")(local);
        const html = local.render("::: warning\ntext\n:::");
        expect(html).toContain("ui warning message");
        expect(html).not.toContain("header");
    });

    it("renders container with title", () => {
        const local = new MarkdownIt();
        baseFactory("warning", "ui warning message")(local);
        const html = local.render("::: warning Title\ntext\n:::");
        expect(html).toContain("ui warning message");
        expect(html).toContain("Title");
    });
});

describe("markdownIt instance", () => {
    it("wraps render output and segments code", () => {
        const instance = (md as any).newInstance("key", "pid");
        const html = instance.render("```js\nconst a = 1\n```");
        expect(html).toContain("markdown-body");
        expect(html).toContain("ui segment");
        expect(html).toContain("Copy");
    });

    it("renderPlain returns raw html", () => {
        const instance = (md as any).newInstance("key2", "pid2");
        const html = instance.renderPlain("# Title");
        expect(html).toContain("<h1");
        expect(html).not.toContain("markdown-body");
    });

    it("renderRaw returns inline html", () => {
        const instance = (md as any).newInstance("key3", "pid3");
        const html = instance.renderRaw("**bold**");
        expect(html).toContain("<strong>");
    });

    it("supports modules without default exports", () => {
        jest.resetModules();
        jest.doMock("markdown-it-anchor", () => function () {});
        jest.doMock("../../src/lib/markdownIt/markdown-it-table-contents", () => function () {});
        jest.doMock("mermaid", () => ({
            parse: jest.fn(),
            initialize: jest.fn()
        }));
        jest.isolateModules(() => {
            const isolatedMd = require("../../src/lib/markdownIt/markdownIt").default;
            const instance = isolatedMd.newInstance("key4", "pid4");
            const html = instance.render("# Title");
            expect(html).toContain("markdown-body");
        });
    });
});
