import Vue from "vue";
import $ from "jquery";
import { Component } from "vue-property-decorator";
@Component
export default class MermaidMixin extends Vue {
    created () {
        const that = this;
        $(document).on("click", function () {
            that.initVisibleMermaid();
        });
    }

    // mermaid is ~1MB: only fetch it when the page really has a diagram to render
    loadMermaid (): Promise<any> {
        return import(/* webpackChunkName: "mermaid" */ "mermaid").then(m => m.default || m);
    }

    initVisibleMermaid () {
        const blocks = $(".mermaid").filter((i: number, v: any) => $(v).is(":visible") && !$(v).attr("data-processed"));
        if (!blocks.length) {
            return;
        }
        this.loadMermaid().then(mermaid => blocks.each((i: number, v: any) => mermaid.init(v)));
    }

    initMermaid () {
        const blocks = $(".mermaid").filter((i: number, v: any) => !$(v).attr("data-processed"));
        if (!blocks.length) {
            return;
        }
        this.loadMermaid().then(mermaid => blocks.each((i: number, v: any) => mermaid.init(v)));
    }
}
